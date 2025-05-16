import { BrowserPieChart } from "@/components/charts/browser-pie-chart";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DevicePieChart } from "@/components/charts/device-pie-chart";
import { HourRadarChart } from "@/components/charts/hour-radar-chart";
import { DateInteractiveLineChart } from "@/components/charts/date-interactive-line-chart";
import { DateBarChart } from "@/components/charts/date-bar-chart";
import { dashboardJsonDateReviver, getAppRoute } from "@/lib/utils";
import { DashboardHomeInfo } from "@/lib/types/internal-api";
import UrlCard from "@/components/url-card";
import { redirect, RedirectType } from "next/navigation";
import { fetchServer } from "../actions/server";

export default async function Dashboard() {
	const response = await fetchServer(getAppRoute("api/internal/dashboard"), {
		next: {
			revalidate: 600,
			tags: ["dashboard"],
		},
		cache: "force-cache",
		includeTokens: true,
	});

	if (response.status != 200) {
		redirect(getAppRoute("error"), RedirectType.replace);
	}

	const {
		recentUrls,
		activeUrls,
		dashboardSummary,
		lastMonthVisitors,
		lastSixMonthVisitors,
		yearVisitors,
		dateVisitorCount,
	}: DashboardHomeInfo = JSON.parse(
		await response.text(),
		dashboardJsonDateReviver,
	);

	return (
		<main className="flex w-full flex-col items-start justify-center gap-3">
			<h1 className="mx-1 text-center text-4xl font-bold">
				Welcome back {dashboardSummary?.user?.firstName}
			</h1>

			<div className="grid w-full grid-cols-2 gap-5 max-xl:grid-cols-1">
				{/* latest urls */}
				<div className="flex w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						Recent URLs
					</h3>
					{recentUrls.length > 0 ? (
						recentUrls.map((url) => (
							<UrlCard isMinimal url={url} key={url.id} />
						))
					) : (
						<span className="text-muted-foreground mx-3 mb-12">
							There&apos;s recent created URL.
						</span>
					)}
				</div>
				{/* active urls */}
				<div className="flex h-full w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						Active URLs
					</h3>
					{activeUrls.length > 0 ? (
						activeUrls.map((url) => (
							<UrlCard isMinimal url={url} key={url.id} />
						))
					) : (
						<span className="text-muted-foreground mx-3 mb-12">
							There&apos;s no URL acessed within 24 hours.
						</span>
					)}
				</div>
			</div>
			<h3 className="mx-3 mt-4 text-3xl font-semibold">Analytics</h3>
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
