import { NextRequest, NextResponse } from "next/server";
import { getAppRoute } from "./lib/utils";
import {
	parseSetCookie,
	RequestCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { routing } from "./i18n/routing";

import createMiddleware from "next-intl/middleware";

async function refreshAuthToken(
	_cookies: RequestCookies,
): Promise<[string, string][] | undefined> {
	const response = await fetch(getAppRoute("api/v1/auth/refresh"), {
		headers: {
			Cookie: `refreshToken=${_cookies.get("refreshToken")?.value}`,
		},
	});

	if (response.headers.has("Set-Cookie")) {
		const responseCookie = parseSetCookie(
			response.headers.get("Set-Cookie")!,
		);
		if (typeof responseCookie == "undefined")
			throw new Error(
				"Unable to refresh authToken: responseCookie is undefined",
			);

		_cookies.set(responseCookie);

		return [
			[
				"Cookie",
				`refreshToken=${_cookies.get("refreshToken")?.value};authToken=${responseCookie.value}`,
			],
			["Set-Cookie", response.headers.get("Set-Cookie")!],
		];
	} else {
		throw new Error(
			"Unable to refresh authToken: response has no set-cookie",
		);
	}
}

function getResponseWithHeader(
	response: NextResponse,
	headers: [string, string][],
): NextResponse {
	for (const [key, value] of headers) {
		response.headers.append(key, value);
	}
	return response;
}

function getResponseWithDeletedTokens(response: NextResponse): NextResponse {
	response.headers.append(
		"Set-Cookie",
		`refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
	);
	response.headers.append(
		"Set-Cookie",
		`authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict`,
	);

	return response;
}
const handleI18nRouting = createMiddleware(routing);

export async function middleware(req: NextRequest) {
	console.log(
		`${req.nextUrl.pathname} - ${Intl.DateTimeFormat("default", { dateStyle: "long", timeStyle: "long" }).format(Date.now())}`,
	);

	const isOffline = await fetch(getAppRoute("api/v1/ping"))
		.then(() => false)
		.catch(() => true);

	const response = handleI18nRouting(req);
	if (/^\/(?!api.*$|en.*$|pt.*$)$/.test(req.nextUrl.pathname)) {
		return response;
	}

	if (isOffline) {
		console.log("API is offline, exiting");
		if (/^\/(?!error[\/]?$|api.*$)$/.test(req.nextUrl.pathname)) {
			return NextResponse.rewrite(getAppRoute("error"));
		} else {
			return new NextResponse("Not found", { status: 404 });
		}
	}

	try {
		const _cookies = req.cookies;

		const hasRefresh =
			_cookies.has("refreshToken") &&
			_cookies.get("refreshToken")!.value.length > 0;
		const hasAuth =
			_cookies.has("authToken") &&
			_cookies.get("authToken")!.value.length > 0;

		if (
			!hasRefresh &&
			/^\/(en|pt)\/dashboard(.*)/.test(req.nextUrl.pathname)
		) {
			console.log(
				"No refreshToken found, resetting cookies and redirecting to login.",
			);
			return getResponseWithDeletedTokens(
				NextResponse.redirect(getAppRoute("login")),
			);
		}

		const refreshHeaders: [string, string][] = [];
		if (
			!hasAuth &&
			!/^\/api\/v1\/auth\/refresh[/]?$/.test(req.nextUrl.pathname) &&
			hasRefresh
		) {
			const _cookieHeaders = await refreshAuthToken(_cookies);
			if (_cookieHeaders) refreshHeaders.push(..._cookieHeaders);
		}

		return getResponseWithHeader(response, refreshHeaders);
		// return getResponseWithHeader(NextResponse.next(), refreshHeaders);
	} catch (err) {
		console.log(err);
		return NextResponse.redirect(getAppRoute(""));
	}
}

export const config = {
	// "/login",
	// "/register",
	// "/error",
	// "/dashboard/:path*",
	// "/api/:path*",
	// matcher: ["/((?!.*\\.).*)"],
	// /api/v1/:path*
	// "/dashboard/:path*"
	matcher: [
		"/(pt|en)?/(pricing$|contact$|faq$|dashboard.*$)?",
		"/(pt|en)?/((?!api|_next|static)[^\\.]+)?",
		"/(.*)/api/v1/((?!ping$|auth/refresh$).*)",
	],
};
