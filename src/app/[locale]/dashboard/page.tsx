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
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import UrlCardSkeleton from "@/components/url-card-skeleton";
import { getDashboardHomeInfo } from "../actions/dashboard/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

export default function Dashboard({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const [dashboardHomeInfo, setDashboardHomeInfo] = useState<
		DashboardHomeInfo | undefined
	>(undefined);

	const { locale } = use(params);

	const _getDashboardHomeInfo = async () => {
		try {
			const result = await getDashboardHomeInfo();
			setDashboardHomeInfo(result);
		} catch (err) {
			toast.error(t("fetch_analytics_error"), { richColors: true });
			if (err instanceof Error) console.log(err.message);
			else console.log(err);
		}
	};

	useEffect(() => {
		_getDashboardHomeInfo();
	}, []);

	const chartT = useTranslations("charts");
	const t = useTranslations("dashboard");

	return (
		<main className="flex w-full flex-col items-start justify-center space-y-4">
			<h1 className="mx-1 my-0 text-center text-4xl font-bold">
				{t("welcome_message")}{" "}
				{dashboardHomeInfo?.dashboardSummary.user?.firstName}
			</h1>
			<div className="text-muted-foreground mx-2 mt-0 flex flex-row items-center justify-start gap-2 max-md:text-sm">
				<Info size={18} className="min-w-[18px] max-sm:hidden" />
				<span>{t("analytics_update_message")}</span>
			</div>

			<div className="grid w-full grid-cols-2 gap-5 max-xl:grid-cols-1">
				{/* latest urls */}
				<div className="flex w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						{t("recent_urls.title")}
					</h3>
					{dashboardHomeInfo ? (
						dashboardHomeInfo.recentUrls.length > 0 ? (
							dashboardHomeInfo?.recentUrls.map((url) => (
								<UrlCard isMinimal url={url} key={url.id} />
							))
						) : (
							<span className="text-muted-foreground mx-3 mb-12">
								{t("recent_urls.fallback")}
							</span>
						)
					) : (
						<UrlCardSkeleton isMinimal />
					)}
				</div>
				{/* active urls */}
				<div className="flex h-full w-full flex-col items-stretch justify-start gap-3">
					<h3 className="mx-3 mt-5 text-3xl font-semibold">
						{t("active_urls.title")}
					</h3>
					{dashboardHomeInfo ? (
						dashboardHomeInfo.activeUrls.length > 0 ? (
							dashboardHomeInfo?.activeUrls.map((url) => (
								<UrlCard isMinimal url={url} key={url.id} />
							))
						) : (
							<span className="text-muted-foreground mx-3 mb-12">
								{t("active_urls.fallback")}
							</span>
						)
					) : (
						<UrlCardSkeleton isMinimal />
					)}
				</div>
			</div>
			<h3 className="mx-3 mt-4 text-3xl font-semibold">
				{t("analytics.title")}
			</h3>
			{/*summary*/}

			<div className="mx-3 my-2">
				{dashboardHomeInfo ? (
					<p className="text-2xl font-semibold">
						{t("analytics.total_clicks")}:{" "}
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
						title={chartT("browser-distribution.title")}
						description={chartT("browser-distribution.description")}
						checkboxLabel={chartT(
							"browser-distribution.checkbox-label",
						)}
						footerDescription={chartT(
							"browser-distribution.footerDescription",
						)}
					/>
					<CountryPieChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByCountry
						}
						title={chartT("country-distribution.title")}
						description={chartT("country-distribution.description")}
						checkboxLabel={chartT(
							"country-distribution.checkbox-label",
						)}
						footerDescription={chartT(
							"country-distribution.footerDescription",
						)}
					/>
					<DevicePieChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByDevice
						}
						title={chartT("device-distribution.title")}
						description={chartT("device-distribution.description")}
						checkboxLabel={chartT(
							"device-distribution.checkbox-label",
						)}
						footerDescription={chartT(
							"device-distribution.footerDescription",
						)}
					/>
					<HourRadarChart
						rawChartData={
							dashboardHomeInfo?.dashboardSummary?.summary
								.countByTimeOfDay
						}
						title={chartT("hour-distribution.title")}
						description={chartT("hour-distribution.description")}
						footerDescription={chartT(
							"hour-distribution.footerDescription",
						)}
					/>
					<DateBarChart
						chartData={dashboardHomeInfo?.yearVisitors}
						title={chartT("past-year.title")}
						description={chartT("past-year.description")}
						footerDescription={chartT(
							"past-year.footerDescription",
						)}
						className="col-span-2 max-xl:col-span-2 max-sm:col-span-1"
					/>

					<DateBarChart
						chartData={dashboardHomeInfo?.lastSixMonthVisitors}
						title={chartT("past-six-months.title")}
						description={chartT("past-six-months.description")}
						footerDescription={chartT(
							"past-six-months.footerDescription",
						)}
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardHomeInfo?.lastMonthVisitors}
						title={chartT("past-30-days.title")}
						description={chartT("past-30-days.description")}
						locale={locale}
					/>

					<DateInteractiveLineChart
						className="col-span-2 max-xl:col-span-3 max-md:col-span-2 max-sm:col-span-1"
						rawChartData={dashboardHomeInfo?.dateVisitorCount}
						title={chartT("all-period.title")}
						description={chartT("all-period.description")}
						locale={locale}
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
