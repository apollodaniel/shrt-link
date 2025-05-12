import { ShortenedUrlSummary, User } from "./api";

export type DashboardHomeInfo = {
	user: User;
	summary: ShortenedUrlSummary;
};

export enum SessionStatus {
	AUTHENTICATED = "authenticated",
	NO_SESSION = "no_session",
}

export type ShortenedUrlMetadata = {
	title?: string;
	image?: string;
};

export type DateChartData = {
	date: Date;
	count: number;
};
