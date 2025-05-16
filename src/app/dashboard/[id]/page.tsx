import { BrowserPieChart } from "@/components/charts/browser-pie-chart";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DevicePieChart } from "@/components/charts/device-pie-chart";
import { HourRadarChart } from "@/components/charts/hour-radar-chart";
import { DateInteractiveLineChart } from "@/components/charts/date-interactive-line-chart";
import { DateBarChart } from "@/components/charts/date-bar-chart";
import {
	dashboardJsonDateReviver,
	getAppRoute,
	getFullShortenedUrl,
	getUrlHostname,
} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import DeleteUrlButton from "@/components/delete-url-button";
import { fetchServer } from "@/app/actions/server";
import { redirect, RedirectType } from "next/navigation";
import { DashboardUrlInfo } from "@/lib/types/internal-api";
import { Info } from "lucide-react";

export default async function UrlDashboard({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const response = await fetchServer(
		getAppRoute(`api/internal/dashboard/url?id=${id}`),
		{
			next: {
				revalidate: 600,
				tags: ["dashboard"],
			},
			cache: "force-cache",
			includeTokens: true,
		},
	);

	if (response.status != 200) {
		redirect(getAppRoute("error"), RedirectType.replace);
	}

	const {
		dashboardSummary,
		lastMonthVisitors,
		lastSixMonthVisitors,
		yearVisitors,
		dateVisitorCount,
	}: DashboardUrlInfo = JSON.parse(
		await response.text(),
		dashboardJsonDateReviver,
	);

	return (
		<main className="flex w-full max-w-[100vw] flex-col items-start justify-center space-y-3 max-sm:pb-12">
			{dashboardSummary?.url.originalUrl && (
				<Link
					href={getAppRoute(dashboardSummary!.url.id)!}
					className="mx-1 my-0 max-w-full text-start text-4xl font-bold break-words hover:underline max-md:text-3xl max-sm:text-xl"
				>
					{getFullShortenedUrl(dashboardSummary!.url.id)}
				</Link>
			)}

			{dashboardSummary?.url.metadata && (
				<div className="text-muted-foreground max-lg:text-md mx-1 my-0 flex w-full max-w-full flex-row items-center gap-2 text-start text-lg font-medium max-sm:text-sm">
					{dashboardSummary?.url.metadata?.image && (
						<Image
							alt={
								dashboardSummary?.url.metadata?.title ||
								getUrlHostname(
									dashboardSummary?.url.originalUrl,
								)
							}
							src={dashboardSummary?.url.metadata!.image}
							height={24}
							width={24}
							className="aspect-square h-[24px] w-[24px] overflow-hidden object-cover"
						/>
					)}
					{dashboardSummary?.url.metadata?.title && (
						<span>{dashboardSummary?.url.metadata?.title}</span>
					)}
				</div>
			)}
			{dashboardSummary?.url.originalUrl && (
				<Link
					href={dashboardSummary!.url.originalUrl}
					className="text-muted-foreground hover:text-primary/80 max-lg:text-md mx-1 mt-0 max-w-full text-start text-lg font-medium hover:underline max-sm:text-sm"
				>
					{dashboardSummary!.url.originalUrl}
				</Link>
			)}

			<div className="text-muted-foreground mx-2 mt-0 flex flex-row items-center justify-start gap-2 max-md:text-sm">
				<Info size={18} className="min-w-[18px] max-sm:hidden" />
				<span>
					This summary updates every 10 minutes. Changes made during
					this time will be visible after the next refresh.
				</span>
			</div>

			{dashboardSummary?.url && (
				<div className="mx-3 mt-4 flex w-full flex-row items-center justify-between">
					<h3 className="text-3xl font-semibold">Analytics</h3>
					<DeleteUrlButton id={dashboardSummary!.url.id} />
				</div>
			)}

			{/*summary*/}
			<div className="mb-20 grid w-full grid-cols-4 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
				<BrowserPieChart
					rawChartData={dashboardSummary?.summary.countByBrowser}
				/>
				<CountryPieChart
					rawChartData={dashboardSummary?.summary.countByCountry}
				/>
				<DevicePieChart
					rawChartData={dashboardSummary?.summary.countByDevice}
				/>
				<HourRadarChart
					rawChartData={dashboardSummary?.summary.countByTimeOfDay}
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
