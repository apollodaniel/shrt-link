"use server";

import { ShortenedUrl, ShortenedUrlSummary, User } from "@/lib/types/api";
import { checkFavicon, getAppRoute, jsonDateReviver } from "@/lib/utils";
import { fetchServer } from "../server";
import { DashboardHomeInfo, ShortenedUrlMetadata } from "@/lib/types/types";
import jsdom from "jsdom";

export async function getUser(): Promise<User> {
	const response = await fetchServer(getAppRoute("api/v1/users/current"), {
		includeTokens: true,
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}

export async function getUrlSummary(id?: string): Promise<ShortenedUrlSummary> {
	const route = id
		? getAppRoute(`api/v1/urls/${id}/summary`)
		: getAppRoute("api/v1/url/summary");
	const response = await fetchServer(route, {
		includeTokens: true,
		next: {
			revalidate: 60 * 5,
		},
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}

export async function getDashboardHomeInfo(): Promise<DashboardHomeInfo> {
	try {
		const user = await getUser();
		const summary = await getUrlSummary();

		return {
			user,
			summary,
		};
	} catch (err) {
		throw err;
	}
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
