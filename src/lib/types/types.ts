export enum SessionStatus {
	AUTHENTICATED = "authenticated",
	NO_SESSION = "no_session",
}

export type ShortenedUrlMetadata = {
	title?: string;
	image?: string;
};
