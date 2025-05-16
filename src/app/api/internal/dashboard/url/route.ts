import { getUrlDashboardSummary } from "@/app/actions/dashboard/url-dashboard";
import {
	dateListToMonthList,
	dateListToYearList,
	filterDateListRange,
} from "@/lib/utils/string";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(request: NextRequest) {
	try {
		const id = request.nextUrl.searchParams.get("id");
		console.log(id);
		const urlDashboardSummary = await getUrlDashboardSummary(id!);

		const dateVisitorCount = (
			urlDashboardSummary?.summary.countByDay || []
		).map((e) => {
			return {
				count: e.count,
				date: new Date(e.day),
			};
		});
		const [lastMonthVisitors, filteredSixMonths, yearVisitors] =
			await Promise.all([
				filterDateListRange(dateVisitorCount, 1),
				filterDateListRange(dateVisitorCount, 6),
				dateListToYearList(dateVisitorCount),
			]);

		const lastSixMonthVisitors = dateListToMonthList(filteredSixMonths);

		return NextResponse.json(
			{
				dashboardSummary: urlDashboardSummary,
				lastMonthVisitors,
				yearVisitors,
				lastSixMonthVisitors,
				dateVisitorCount,
			},
			{
				status: 200,
			},
		);
	} catch (err) {
		if (err instanceof Error) console.log(err.message);

		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : err,
			},
			{
				status: 500,
			},
		);
	}
}
