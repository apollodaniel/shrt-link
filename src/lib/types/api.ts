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
