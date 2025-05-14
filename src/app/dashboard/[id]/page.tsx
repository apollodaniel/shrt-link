import { UrlDashboardInfo } from "@/lib/types/types";
import { getUrlDashboardInfo } from "../../actions/dashboard/url-dashboard";
import { BrowserPieChart } from "@/components/charts/browser-pie-chart";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DevicePieChart } from "@/components/charts/device-pie-chart";
import { HourRadarChart } from "@/components/charts/hour-radar-chart";
import { DateInteractiveLineChart } from "@/components/charts/date-interactive-line-chart";
import { DateBarChart } from "@/components/charts/date-bar-chart";
import {
	dateListToMonthList,
	dateListToYearList,
	filterDateListRange,
} from "@/lib/utils/string";
import { getAppRoute, getFullShortenedUrl, getUrlHostname } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import DeleteUrlButton from "@/components/delete-url-button";

export default async function UrlDashboard({ params }) {
	const _params: { id: string } = await params;
	let urlDashboardInfo: UrlDashboardInfo | undefined;
	try {
		urlDashboardInfo = await getUrlDashboardInfo(_params.id);
	} catch (err) {
		console.log(err);
	}

	const dateVisitorCount = (urlDashboardInfo?.summary.countByDay || []).map(
		(e) => {
			return {
				...e,
				date: new Date(e.day),
			};
		},
	);
	const lastMonthVisitors = filterDateListRange(dateVisitorCount, 1);
	const filteredSixMonths = filterDateListRange(dateVisitorCount, 6);
	const lastSixMonthVisitors = dateListToMonthList(filteredSixMonths);
	const yearVisitors = dateListToYearList(dateVisitorCount);

	return (
		<main className="flex w-full max-w-[100vw] flex-col items-start justify-center space-y-3 max-sm:pb-12">
			{urlDashboardInfo?.url.originalUrl && (
				<Link
					href={getAppRoute(urlDashboardInfo!.url.id)!}
					className="mx-1 my-0 max-w-full text-start text-4xl font-bold break-words hover:underline max-md:text-3xl max-sm:text-xl"
				>
					{getFullShortenedUrl(urlDashboardInfo!.url.id)}
				</Link>
			)}

			{urlDashboardInfo?.url.metadata && (
				<div className="text-muted-foreground max-lg:text-md mx-1 my-0 flex w-full max-w-full flex-row items-center gap-2 text-start text-lg font-medium max-sm:text-sm">
					{urlDashboardInfo?.url.metadata?.image && (
						<Image
							alt={
								urlDashboardInfo?.url.metadata?.title ||
								getUrlHostname(
									urlDashboardInfo?.url.originalUrl,
								)
							}
							src={urlDashboardInfo?.url.metadata!.image}
							height={24}
							width={24}
							className="aspect-square h-[24px] w-[24px] object-cover"
						/>
					)}
					{urlDashboardInfo?.url.metadata?.title && (
						<span>{urlDashboardInfo?.url.metadata?.title}</span>
					)}
				</div>
			)}
			{urlDashboardInfo?.url.originalUrl && (
				<Link
					href={urlDashboardInfo!.url.originalUrl}
					className="text-muted-foreground hover:text-primary/80 max-lg:text-md mx-1 mt-0 max-w-full text-start text-lg font-medium hover:underline max-sm:text-sm"
				>
					{urlDashboardInfo!.url.originalUrl}
				</Link>
			)}

			{urlDashboardInfo?.url && (
				<div className="mx-3 mt-4 flex w-full flex-row items-center justify-between">
					<h3 className="text-3xl font-semibold">Analytics</h3>
					<DeleteUrlButton id={urlDashboardInfo!.url.id} />
				</div>
			)}
			{/*summary*/}
			<div className="mb-20 grid w-full grid-cols-4 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
				<BrowserPieChart
					rawChartData={urlDashboardInfo?.summary.countByBrowser}
				/>
				<CountryPieChart
					rawChartData={urlDashboardInfo?.summary.countByCountry}
				/>
				<DevicePieChart
					rawChartData={urlDashboardInfo?.summary.countByDevice}
				/>
				<HourRadarChart
					rawChartData={urlDashboardInfo?.summary.countByTimeOfDay}
					description="See the most accessed hours of the day"
				/>

				<DateBarChart
					chartData={yearVisitors}
					title="Yearly Visitor Distribution"
					description="Visual representation of visitor distribution throughout the year."
					footerDescription="Displays total visitors for the entire year."
					className="col-span-2 max-xl:col-span-2 max-sm:col-span-1"
				/>

				<DateBarChart
					chartData={lastSixMonthVisitors}
					title="Visitor Distribution (Last 6 Months)"
					description="Shows the distribution of visitors over the past six months."
					footerDescription="Displays visitor data for the last 6 months."
					className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
				/>

				<DateInteractiveLineChart
					className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
					rawChartData={lastMonthVisitors}
					title="Visitor Count (Last 30 Days)"
					description="Displays total visitors for the past 30 days."
				/>

				<DateInteractiveLineChart
					className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
					rawChartData={dateVisitorCount}
					title="Total Visitors (All Time)"
					description="Displays total visitor count by date over the entire period."
				/>
			</div>
		</main>
	);
}
