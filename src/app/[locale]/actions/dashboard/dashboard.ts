"use server";

import { ShortenedUrl, ShortenedUrlSummary, User } from "@/lib/types/api";
import {
	checkFavicon,
	getAppRoute,
	getLatestStatistic,
	jsonDateReviver,
} from "@/lib/utils";
import { fetchServer, ServerRequestInit } from "../server";
import { ShortenedUrlMetadata } from "@/lib/types/types";
import jsdom from "jsdom";
import {
	revalidateTag,
	unstable_cacheTag as cacheTag,
	unstable_cacheLife as cacheLife,
} from "next/cache";
import { DashboardHomeInfo, DashboardSummary } from "@/lib/types/internal-api";
import { getUrlList } from "./list";
import {
	dateListToMonthList,
	dateListToYearList,
	filterDateListRange,
} from "@/lib/utils/string";
import { cookies } from "next/headers";

export async function getUser(reqOpt?: ServerRequestInit): Promise<User> {
	const response = await fetchServer(getAppRoute("api/v1/users/current"), {
		includeTokens: true,
		...reqOpt,
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}

export async function getUrlSummary(
	id?: string,
	reqOpt?: ServerRequestInit,
): Promise<ShortenedUrlSummary> {
	const route = id
		? getAppRoute(`api/v1/urls/${id}/summary`)
		: getAppRoute("api/v1/url/summary");
	const response = await fetchServer(route, {
		includeTokens: true,
		next: {
			revalidate: 60 * 5,
		},
		...reqOpt,
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}

export async function getDashboardSummary(
	reqOpt?: ServerRequestInit,
): Promise<DashboardSummary> {
	try {
		const [user, summary] = await Promise.all([
			getUser(reqOpt),
			getUrlSummary(undefined, reqOpt),
		]);

		return {
			user,
			summary,
		};
	} catch (err) {
		throw err;
	}
}

export async function revalidateSummary(): Promise<void> {
	console.log("Revalidating summary");
	revalidateTag("summary");
}

export async function getUrlMetadata(
	url: ShortenedUrl,
): Promise<ShortenedUrlMetadata | undefined> {
	const page = await fetch(url.originalUrl);

	if (page.status != 200) {
		return undefined;
	}

	const rawPage = await page.text();
	const dom = new jsdom.JSDOM(rawPage);
	const isRootFavicon = await checkFavicon(url.originalUrl);

	let favicon;

	if (isRootFavicon) {
		favicon = `${url.originalUrl}/favicon.ico`;
	} else {
		const element =
			dom.window.document.querySelector('link[rel="shortcut-icon"]') ||
			dom.window.document.querySelector('link[rel="icon"]');
		favicon = element?.getAttribute("href") || "None";
	}

	console.log(`Icon: ${favicon}`);
	return {
		title: dom.window.document.title,
		image: favicon,
	};
}

export async function getDashboardHomeInfo(): Promise<DashboardHomeInfo> {
	const _cookies = await cookies();
	const headers: HeadersInit = [];
	if (_cookies.has("refreshToken")) {
		headers.push([
			"Cookie",
			`refreshToken=${_cookies.get("refreshToken")?.value}${_cookies.has("authToken") ? ";authToken=" + _cookies.get("authToken")?.value : ""}`,
		]);
	}
	return buildDashboardHomeInfo(headers);
}

export async function buildDashboardHomeInfo(
	headers: HeadersInit | undefined,
): Promise<DashboardHomeInfo> {
	"use cache";
	cacheLife("default");
	cacheTag("summary");

	const [urls, dashboardSummary] = await Promise.all([
		getUrlList({
			cache: "no-store",
			headers,
		}),
		getDashboardSummary({
			cache: "no-store",
			headers,
		}),
	]);

	const dateVisitorCount = (dashboardSummary?.summary.countByDay || []).map(
		(e) => {
			return {
				count: e.count,
				date: new Date(e.day),
			};
		},
	);
	const [lastMonthVisitors, filteredSixMonths, yearVisitors] =
		await Promise.all([
			filterDateListRange(dateVisitorCount, 1),
			filterDateListRange(dateVisitorCount, 6),
			dateListToYearList(dateVisitorCount),
		]);

	const lastSixMonthVisitors = dateListToMonthList(filteredSixMonths);

	const [recentUrls, activeUrls] = await Promise.all([
		urls
			.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime())
			.slice(0, 3),
		urls
			.filter((a) =>
				a.statistics.find(
					(s) =>
						Date.now() - s.accessTime.getTime() <
						24 * 60 * 60 * 1000,
				),
			)
			.sort(
				(a, b) =>
					getLatestStatistic(b).accessTime.getTime() -
					getLatestStatistic(a).accessTime.getTime(),
			)
			.slice(0, 3),
	]);

	return {
		dashboardSummary,
		lastMonthVisitors,
		yearVisitors,
		lastSixMonthVisitors,
		recentUrls,
		activeUrls,
		dateVisitorCount,
	};
}
