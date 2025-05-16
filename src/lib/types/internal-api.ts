import { ShortenedUrl, ShortenedUrlSummary, User } from "./api";
import { DateChartData, DateStringChartData } from "./types";

// dasboard
export type DashboardSummary = {
	user: User;
	summary: ShortenedUrlSummary;
};

export type DashboardHomeInfo = {
	dashboardSummary: DashboardSummary;
	lastMonthVisitors: DateChartData[];
	dateVisitorCount: DateChartData[];
	yearVisitors: DateStringChartData[];
	lastSixMonthVisitors: DateStringChartData[];
	recentUrls: ShortenedUrl[];
	activeUrls: ShortenedUrl[];
};
