"use server";

import { fetchServer } from "../server";
import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { ShortenedUrl } from "@/lib/types/api";
import { getUrlMetadata, getUrlSummary } from "./dashboard";
import { UrlDashboardSummary } from "@/lib/types/internal-api";

export async function getUrl(
	id: string,
	cache?: RequestCache,
): Promise<ShortenedUrl> {
	const response = await fetchServer(getAppRoute(`api/v1/urls/${id}`), {
		includeTokens: true,
		cache,
	});
	const text = await response.text();

	if (response.status == 200) {
		const urlBase = JSON.parse(text, jsonDateReviver);
		const metadata = await getUrlMetadata(urlBase);

		return {
			...urlBase,
			metadata,
		};
	}

	throw new Error(`${response.status} - ${text}`);
}

export async function getUrlDashboardSummary(
	urlId: string,
	cache?: RequestCache,
): Promise<UrlDashboardSummary> {
	try {
		const [url, summary] = await Promise.all([
			getUrl(urlId, cache),
			getUrlSummary(urlId, cache),
		]);

		return {
			url,
			summary,
		};
	} catch (err) {
		throw err;
	}
}
