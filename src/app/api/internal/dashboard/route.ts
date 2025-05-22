import { getDashboardSummary } from "@/app/actions/dashboard/dashboard";
import { getUrlList } from "@/app/actions/dashboard/list";
import { getLatestStatistic } from "@/lib/utils";
import {
	dateListToMonthList,
	dateListToYearList,
	filterDateListRange,
} from "@/lib/utils/string";
import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET() {
	try {
		const [urls, dashboardSummary] = await Promise.all([
			getUrlList("no-cache"),
			getDashboardSummary("no-cache"),
		]);

		const dateVisitorCount = (
			dashboardSummary?.summary.countByDay || []
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

		const [recentUrls, activeUrls] = await Promise.all([
			urls
				.sort(
					(a, b) =>
						b.creationDate.getTime() - a.creationDate.getTime(),
				)
				.slice(0, 3),
			urls
				.filter((a) =>
					a.statistics.find(
						(s) =>
							Date.now() - s.accessTime.getTime() <
							24 * 60 * 60 * 1000,
					),
				)
				.sort(
					(a, b) =>
						getLatestStatistic(b).accessTime.getTime() -
						getLatestStatistic(a).accessTime.getTime(),
				)
				.slice(0, 3),
		]);

		return NextResponse.json(
			{
				dashboardSummary,
				lastMonthVisitors,
				yearVisitors,
				lastSixMonthVisitors,
				recentUrls,
				activeUrls,
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
