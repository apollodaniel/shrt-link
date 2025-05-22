import { NextRequest, NextResponse } from "next/server";
import { getAppRoute } from "./lib/utils";
import {
	parseSetCookie,
	RequestCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

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

export async function middleware(req: NextRequest) {
	console.log(
		`${req.nextUrl.pathname} - ${Intl.DateTimeFormat("default", { dateStyle: "long", timeStyle: "long" }).format(Date.now())}`,
	);

	const isOffline = await fetch(getAppRoute("api/v1/ping"))
		.then(() => false)
		.catch(() => true);

	if (isOffline) {
		console.log("API is offline, exiting");
		if (/^\/api\/v1(.*)/.test(req.nextUrl.pathname)) {
			return new NextResponse("Not found", { status: 404 });
		} else {
			return NextResponse.rewrite(getAppRoute("error"));
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

		if (!hasRefresh && /^\/dashboard(.*)/.test(req.nextUrl.pathname)) {
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

		return getResponseWithHeader(NextResponse.next(), refreshHeaders);
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
	matcher: ["/dashboard/:path*", "/api/v1/((?!ping$|auth/refresh$).*)"],
};
