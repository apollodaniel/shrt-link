"use client";

import { BrowserPieChart } from "@/components/charts/browser-pie-chart";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DevicePieChart } from "@/components/charts/device-pie-chart";
import { DateInteractiveLineChart } from "@/components/charts/date-interactive-line-chart";
import { DateBarChart } from "@/components/charts/date-bar-chart";
import { DashboardHomeInfo } from "@/lib/types/internal-api";
import UrlCard from "@/components/url-card";
import { Info } from "lucide-react";
import { HourRadarChart } from "@/components/charts/hour-radar-chart";
import { PieChartSkeleton } from "@/components/charts/pie-chart-skeleton";
import { RadarChartSkeleton } from "@/components/charts/radar-chart-skeleton";
import { BarChartSkeleton } from "@/components/charts/bar-chart-skeleton";
import { InteractiveLineChartSkeleton } from "@/components/charts/interactive-line-chart-skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UrlCardSkeleton from "@/components/url-card-skeleton";
import { getDashboardHomeInfo } from "../actions/dashboard/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
	const [dashboardHomeInfo, setDashboardHomeInfo] = useState<
		DashboardHomeInfo | undefined
	>(undefined);

	const _getDashboardHomeInfo = async () => {
		try {
			const result = await getDashboardHomeInfo();
			setDashboardHomeInfo(result);
		} catch (err) {
			toast("Unable to get dashboard analytics, try again later.");
			if (err instanceof Error) console.log(err.message);
			else console.log(err);
		}
	};

	useEffect(() => {
		_getDashboardHomeInfo();
	}, []);

	return (
		<main className="flex w-full flex-col items-start justify-center space-y-4">
			<h1 className="mx-1 my-0 text-center text-4xl font-bold">
				Welcome back{" "}
				{dashboardHomeInfo?.dashboardSummary.user?.firstName}
			</h1>
			<div className="text-muted-foreground mx-2 mt-0 flex flex-row items-center justify-start gap-2 max-md:text-sm">
				<Info size={18} className="min-w-[18px] max-sm:hidden" />
				<span>
					This summary is periodically updated. Recent changes may
					take some time to appear.
				</span>
			</div>

			<div className="grid w-full grid-cols-2 gap-5 max-xl:grid-cols-1">
				{/* latest urls */}
				<div className="flex w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						Recent URLs
					</h3>
					{dashboardHomeInfo ? (
						dashboardHomeInfo.recentUrls.length > 0 ? (
							dashboardHomeInfo?.recentUrls.map((url) => (
								<UrlCard isMinimal url={url} key={url.id} />
							))
						) : (
							<span className="text-muted-foreground mx-3 mb-12">
								There&apos;s recent created URL.
							</span>
						)
					) : (
						<UrlCardSkeleton isMinimal />
					)}
				</div>
				{/* active urls */}
				<div className="flex h-full w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						Active URLs
					</h3>
					{dashboardHomeInfo ? (
						dashboardHomeInfo.activeUrls.length > 0 ? (
							dashboardHomeInfo?.activeUrls.map((url) => (
								<UrlCard isMinimal url={url} key={url.id} />
							))
						) : (
							<span className="text-muted-foreground mx-3 mb-12">
								There&apos;s no URL acessed within 24 hours.
							</span>
						)
					) : (
						<UrlCardSkeleton isMinimal />
					)}
				</div>
			</div>
			<h3 className="mx-3 mt-4 text-3xl font-semibold">Analytics</h3>
			{/*summary*/}

			<div className="mx-3 my-2">
				{dashboardHomeInfo ? (
					<p className="text-2xl font-semibold">
						Total clicks:{" "}
						{dashboardHomeInfo?.dashboardSummary.summary
							.totalClicks || 0}
					</p>
				) : (
					<Skeleton className="h-4 w-[56px]" />
				)}
			</div>
			{dashboardHomeInfo ? (
				<div className="mb-20 grid w-full grid-cols-4 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
					<BrowserPieChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByBrowser
						}
					/>
					<CountryPieChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByCountry
						}
					/>
					<DevicePieChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByDevice
						}
					/>
					<HourRadarChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByTimeOfDay
						}
						description="See the most accessed hours of the day"
					/>
					<DateBarChart
						chartData={dashboardHomeInfo?.yearVisitors}
						title="Yearly Visitor Distribution"
						description="Visual representation of visitor distribution throughout the year."
						footerDescription="Displays total visitors for the entire year."
						className="col-span-2 max-xl:col-span-2 max-sm:col-span-1"
					/>

					<DateBarChart
						chartData={dashboardHomeInfo?.lastSixMonthVisitors}
						title="Visitor Distribution (Last 6 Months)"
						description="Shows the distribution of visitors over the past six months."
						footerDescription="Displays visitor data for the last 6 months."
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardHomeInfo?.lastMonthVisitors}
						title="Visitor Count (Last 30 Days)"
						description="Displays total visitors for the past 30 days."
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardHomeInfo?.dateVisitorCount}
						title="Total Visitors (All Time)"
						description="Displays total visitor count by date over the entire period."
					/>
				</div>
			) : (
				<div className="mb-20 grid w-full grid-cols-4 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
					<PieChartSkeleton />
					<PieChartSkeleton />
					<PieChartSkeleton />
					<RadarChartSkeleton />

					<BarChartSkeleton className="col-span-2 max-xl:col-span-2 max-sm:col-span-1" />
					<BarChartSkeleton className="col-span-2 max-xl:col-span-2 max-sm:col-span-1" />

					<InteractiveLineChartSkeleton className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1" />
					<InteractiveLineChartSkeleton className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1" />
				</div>
			)}
		</main>
	);
}
