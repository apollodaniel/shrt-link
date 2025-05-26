"use server";

import { fetchServer, ServerRequestInit } from "../server";
import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { ShortenedUrl } from "@/lib/types/api";
import { getUrlMetadata, getUrlSummary } from "./dashboard";
import {
	DashboardUrlInfo,
	UrlDashboardSummary,
} from "@/lib/types/internal-api";
import { cookies } from "next/headers";
import {
	unstable_cacheTag as cacheTag,
	unstable_cacheLife as cacheLife,
} from "next/cache";
import {
	dateListToMonthList,
	dateListToYearList,
	filterDateListRange,
} from "@/lib/utils/string";

export async function getUrl(
	id: string,
	reqOpt?: ServerRequestInit,
): Promise<ShortenedUrl> {
	const response = await fetchServer(getAppRoute(`api/v1/urls/${id}`), {
		includeTokens: true,
		...reqOpt,
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
	reqOpt?: ServerRequestInit,
): Promise<UrlDashboardSummary> {
	try {
		const [url, summary] = await Promise.all([
			getUrl(urlId, reqOpt),
			getUrlSummary(urlId, reqOpt),
		]);

		return {
			url,
			summary,
		};
	} catch (err) {
		throw err;
	}
}

export async function getDashboardUrlInfo(
	id: string,
): Promise<DashboardUrlInfo> {
	const _cookies = await cookies();
	const headers: HeadersInit = [];
	if (_cookies.has("refreshToken")) {
		headers.push([
			"Cookie",
			`refreshToken=${_cookies.get("refreshToken")?.value}${_cookies.has("authToken") ? ";authToken=" + _cookies.get("authToken")?.value : ""}`,
		]);
	}
	return buildDashboardUrlInfo(id, headers);
}

export async function buildDashboardUrlInfo(
	id: string,
	headers: HeadersInit | undefined,
): Promise<DashboardUrlInfo> {
	"use cache";
	cacheLife("default");
	cacheTag("summary");

	console.log(id);
	const urlDashboardSummary = await getUrlDashboardSummary(id, {
		cache: "no-store",
		headers,
	});

	const dateVisitorCount = (
		urlDashboardSummary?.summary.countByDay || []
	).map((e) => {
		return {
			count: e.count,
			date: new Date(e.day),
		};
	});
	const [lastMonthVisitors, filteredSixMonths, yearVisitors] =
		await Promise.all([
			filterDateListRange(dateVisitorCount, 1),
			filterDateListRange(dateVisitorCount, 6),
			dateListToYearList(dateVisitorCount),
		]);

	const lastSixMonthVisitors = dateListToMonthList(filteredSixMonths);

	return {
		dashboardSummary: urlDashboardSummary,
		lastMonthVisitors,
		yearVisitors,
		lastSixMonthVisitors,
		dateVisitorCount,
	};
}
