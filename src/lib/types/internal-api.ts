import { ShortenedUrl, ShortenedUrlSummary, User } from "./api";
import { DateChartData, DateStringChartData } from "./types";

// dasboard
export type DashboardSummary = {
	user: User;
	summary: ShortenedUrlSummary;
};
export type UrlDashboardSummary = {
	url: ShortenedUrl;
	summary: ShortenedUrlSummary;
};

type DashboardInfo = {
	lastMonthVisitors: DateChartData[];
	dateVisitorCount: DateChartData[];
	yearVisitors: DateStringChartData[];
	lastSixMonthVisitors: DateStringChartData[];
};

export type DashboardUrlInfo = {
	dashboardSummary: UrlDashboardSummary;
} & DashboardInfo;

export type DashboardHomeInfo = {
	dashboardSummary: DashboardSummary;
	recentUrls: ShortenedUrl[];
	activeUrls: ShortenedUrl[];
} & DashboardInfo;
