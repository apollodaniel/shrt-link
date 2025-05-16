import { NextRequest, NextResponse } from "next/server";
import { SessionStatus } from "./lib/types/types";
import { getAppRoute } from "./lib/utils";
import { getUserSessionStatus } from "./app/actions/auth";
import { cookies } from "next/headers";
import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies";

async function refreshAuthToken(): Promise<string | undefined> {
	const _cookies = await cookies();

	const response = await fetch(getAppRoute("api/v1/auth/refresh"), {
		headers: {
			Cookie: `refreshToken=${_cookies.get("refreshToken")!.value}`,
		},
	});

	if (response.headers.has("Set-Cookie")) {
		const responseCookie = parseSetCookie(
			response.headers.get("Set-Cookie")!,
		);
		if (typeof responseCookie == "undefined")
			throw new Error("Unable to refresh authToken");

		_cookies.set(responseCookie.name, responseCookie.value, responseCookie);
		return `refreshToken=${_cookies.get("refreshToken")!.value};authToken=${responseCookie.value}`;
	} else {
		throw new Error("Unable to refresh authToken");
	}
}

export async function middleware(req: NextRequest) {
	console.log(req.url);

	const isOffline = await fetch(`${process.env.API_URL}/api/v1/ping`)
		.then(() => false)
		.catch(() => true);

	if (isOffline) {
		if (req.url.startsWith(getAppRoute("api/v1"))) {
			return new NextResponse("Not found", { status: 404 });
		} else {
			return NextResponse.rewrite(getAppRoute("error"));
		}
	}

	try {
		const _cookies = await cookies();

		let cookieHeader = req.headers.get("Cookie");

		const hasRefresh =
			_cookies.has("refreshToken") ||
			_cookies.get("refreshToken")?.value != "";
		const hasAuth =
			_cookies.has("authToken") || _cookies.get("authToken")?.value != "";

		if (!hasRefresh && req.url.startsWith(getAppRoute("dashboard"))) {
			_cookies.delete("refreshToken");
			_cookies.delete("authToken");
			return NextResponse.redirect(getAppRoute("login"));
		}

		if (
			!hasAuth &&
			!req.url.endsWith("api/v1/auth/refresh") &&
			hasRefresh
		) {
			const _cookieHeader = await refreshAuthToken();
			cookieHeader = _cookieHeader ? _cookieHeader : null;
		}

		const responseOpt: ResponseInit = {
			...req,
			headers: cookieHeader
				? {
						Cookie: cookieHeader,
					}
				: undefined,
		};

		if (req.url.startsWith(getAppRoute("api/v1"))) {
			return NextResponse.next(responseOpt);
		} else {
			const sessionStatus = await getUserSessionStatus();

			if (
				req.url.startsWith(getAppRoute("dashboard")) &&
				sessionStatus == SessionStatus.NO_SESSION
			) {
				return NextResponse.redirect(
					getAppRoute("register"),
					responseOpt,
				);
			}

			return NextResponse.next(responseOpt);
		}
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
	matcher: ["/dashboard/:path*", "/api/v1/:path*"],
};
