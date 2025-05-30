"use client";

import { BrowserPieChart } from "@/components/charts/browser-pie-chart";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DevicePieChart } from "@/components/charts/device-pie-chart";
import { HourRadarChart } from "@/components/charts/hour-radar-chart";
import { DateInteractiveLineChart } from "@/components/charts/date-interactive-line-chart";
import { DateBarChart } from "@/components/charts/date-bar-chart";
import { PieChartSkeleton } from "@/components/charts/pie-chart-skeleton";
import { RadarChartSkeleton } from "@/components/charts/radar-chart-skeleton";
import { BarChartSkeleton } from "@/components/charts/bar-chart-skeleton";
import { InteractiveLineChartSkeleton } from "@/components/charts/interactive-line-chart-skeleton";
import { getAppRoute, getFullShortenedUrl, getUrlHostname } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import DeleteUrlButton from "@/components/delete-url-button";
import { DashboardUrlInfo } from "@/lib/types/internal-api";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardUrlInfo } from "@/app/[locale]/actions/dashboard/url-dashboard";

export default function UrlDashboard({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [dashboardUrlInfo, setDashboardUrlInfo] = useState<
		DashboardUrlInfo | undefined
	>(undefined);

	const _getDashboardUrlInfo = async () => {
		try {
			const { id } = await params;
			const result = await getDashboardUrlInfo(id);
			setDashboardUrlInfo(result);
		} catch (err) {
			toast("Unable to get dashboard analytics, try again later.");
			if (err instanceof Error) console.log(err.message);
			else console.log(err);
		}
	};

	useEffect(() => {
		_getDashboardUrlInfo();
	}, []);

	return (
		<main className="flex w-full max-w-[100vw] flex-col items-start justify-center space-y-3 max-sm:pb-12">
			{dashboardUrlInfo?.dashboardSummary?.url.originalUrl ? (
				<Link
					href={
						getAppRoute(dashboardUrlInfo?.dashboardSummary!.url.id)!
					}
					className="mx-1 my-0 max-w-full text-start text-4xl font-bold break-words hover:underline max-md:text-3xl max-sm:text-xl"
				>
					{getFullShortenedUrl(
						dashboardUrlInfo?.dashboardSummary!.url.id,
					)}
				</Link>
			) : (
				<Skeleton className="h-6 w-1/3" />
			)}

			{dashboardUrlInfo ? (
				dashboardUrlInfo?.dashboardSummary?.url.metadata && (
					<div className="text-muted-foreground max-lg:text-md mx-1 my-0 flex w-full max-w-full flex-row items-center gap-2 text-start text-lg font-medium max-sm:text-sm">
						{dashboardUrlInfo?.dashboardSummary?.url.metadata
							?.image && (
							<Image
								alt={
									dashboardUrlInfo?.dashboardSummary?.url
										.metadata?.title ||
									getUrlHostname(
										dashboardUrlInfo?.dashboardSummary?.url
											.originalUrl,
									)
								}
								src={
									dashboardUrlInfo?.dashboardSummary?.url
										.metadata!.image
								}
								height={24}
								width={24}
								className="aspect-square h-[24px] w-[24px] overflow-hidden object-cover"
							/>
						)}
						{dashboardUrlInfo?.dashboardSummary?.url.metadata
							?.title && (
							<span>
								{
									dashboardUrlInfo?.dashboardSummary?.url
										.metadata?.title
								}
							</span>
						)}
					</div>
				)
			) : (
				<Skeleton className="h-6 w-1/3" />
			)}

			{dashboardUrlInfo ? (
				<Link
					href={dashboardUrlInfo?.dashboardSummary!.url.originalUrl}
					className="text-muted-foreground hover:text-primary/80 max-lg:text-md mx-1 mt-0 max-w-full text-start text-lg font-medium hover:underline max-sm:text-sm"
				>
					{dashboardUrlInfo?.dashboardSummary!.url.originalUrl}
				</Link>
			) : (
				<Skeleton className="h-6 w-1/3" />
			)}

			<div className="text-muted-foreground mx-2 mt-0 flex flex-row items-center justify-start gap-2 max-md:text-sm">
				<Info size={18} className="min-w-[18px] max-sm:hidden" />
				<span>
					This summary is periodically updated. Recent changes may
					take some time to appear.
				</span>
			</div>

			{dashboardUrlInfo?.dashboardSummary?.url && (
				<div className="mx-3 mt-4 flex w-full flex-row items-center justify-between">
					<h3 className="text-3xl font-semibold">Analytics</h3>

					<DeleteUrlButton
						id={dashboardUrlInfo?.dashboardSummary!.url.id}
					/>
				</div>
			)}

			<div className="mx-3 my-2">
				{dashboardUrlInfo ? (
					<p className="text-2xl font-semibold">
						Total clicks:{" "}
						{dashboardUrlInfo?.dashboardSummary.summary
							.totalClicks || 0}
					</p>
				) : (
					<Skeleton className="h-4 w-[56px]" />
				)}
			</div>
			{/*summary*/}
			{dashboardUrlInfo ? (
				<div className="mb-20 grid w-full grid-cols-4 gap-3 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
					<BrowserPieChart
						rawChartData={
							dashboardUrlInfo?.dashboardSummary?.summary
								.countByBrowser
						}
					/>
					<CountryPieChart
						rawChartData={
							dashboardUrlInfo?.dashboardSummary?.summary
								.countByCountry
						}
					/>
					<DevicePieChart
						rawChartData={
							dashboardUrlInfo?.dashboardSummary?.summary
								.countByDevice
						}
					/>
					<HourRadarChart
						rawChartData={
							dashboardUrlInfo?.dashboardSummary?.summary
								.countByTimeOfDay
						}
						description="See the most accessed hours of the day"
					/>
					<DateBarChart
						chartData={dashboardUrlInfo?.yearVisitors}
						title="Yearly Visitor Distribution"
						description="Visual representation of visitor distribution throughout the year."
						footerDescription="Displays total visitors for the entire year."
						className="col-span-2 max-xl:col-span-2 max-sm:col-span-1"
					/>

					<DateBarChart
						chartData={dashboardUrlInfo?.lastSixMonthVisitors}
						title="Visitor Distribution (Last 6 Months)"
						description="Shows the distribution of visitors over the past six months."
						footerDescription="Displays visitor data for the last 6 months."
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardUrlInfo?.lastMonthVisitors}
						title="Visitor Count (Last 30 Days)"
						description="Displays total visitors for the past 30 days."
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardUrlInfo?.dateVisitorCount}
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
