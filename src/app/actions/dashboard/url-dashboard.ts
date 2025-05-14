"use server";

import { UrlDashboardInfo } from "@/lib/types/types";
import { fetchServer } from "../server";
import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { ShortenedUrl } from "@/lib/types/api";
import { getUrlMetadata, getUrlSummary } from "./dashboard";

export async function getUrl(id: string): Promise<ShortenedUrl> {
	const response = await fetchServer(getAppRoute(`api/v1/urls/${id}`), {
		includeTokens: true,
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}

export async function getUrlDashboardInfo(
	urlId: string,
): Promise<UrlDashboardInfo> {
	try {
		const url = await getUrl(urlId);
		const summary = await getUrlSummary(urlId);
		const metadata = await getUrlMetadata(url);

		return {
			url: {
				...url,
				metadata,
			},
			summary,
		};
	} catch (err) {
		throw err;
	}
}
