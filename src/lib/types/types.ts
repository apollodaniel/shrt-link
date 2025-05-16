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
export type DateStringChartData = {
	date: string;
	count: number;
};

export type SearchSettings = {
	isActive: boolean;
	order: {
		by: string; // "Creation Date" | "ID"
		order: string; // "ASC" | "DESC"
	};
};
