"use server";

import { fetchServer } from "../server";
import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { ShortenedUrl } from "@/lib/types/api";
import { getUrlMetadata, getUrlSummary } from "./dashboard";
import { UrlDashboardSummary } from "@/lib/types/internal-api";

export async function getUrl(id: string): Promise<ShortenedUrl> {
	const response = await fetchServer(getAppRoute(`api/v1/urls/${id}`), {
		includeTokens: true,
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
): Promise<UrlDashboardSummary> {
	try {
		const [url, summary] = await Promise.all([
			getUrl(urlId),
			getUrlSummary(urlId),
		]);

		return {
			url,
			summary,
		};
	} catch (err) {
		throw err;
	}
}
