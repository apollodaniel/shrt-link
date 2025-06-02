import { ShortenedUrlMetadata } from "./types";

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	creationDate: Date;
};

export type ShortenedUrl = {
	id: string;
	originalUrl: string;
	creationDate: Date;
	statistics: ShortenedUrlStatistic[];
	metadata?: ShortenedUrlMetadata;
};

export type ShortenedUrlStatistic = {
	id: string;
	accessTime: Date;
	ipAddress: string;
	userAgent: string;
	country: string;
	countryCode: string;
	region: string;
	city: string;
	lat: number;
	lon: number;
	device: string;
	browser: string;
};

export type CountByCountry = {
	count: number;
	country: string;
};
export type CountByDevice = {
	count: number;
	device: string;
};
export type CountByBrowser = {
	count: number;
	browser: string;
};
export type CountByDay = {
	count: number;
	day: Date;
};
export type CountByTimeOfDay = {
	count: number;
	hour: string;
};
export type CountByUrlId = {
	count: number;
	urlId: string;
};

export type ShortenedUrlSummary = {
	countByCountry: CountByCountry[];
	countByDevice: CountByDevice[];
	countByBrowser: CountByBrowser[];
	countByDay: CountByDay[];
	countByTimeOfDay: CountByTimeOfDay[];
	totalClicks: number;
	countByUrlId: CountByUrlId[];
};
