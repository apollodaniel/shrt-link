import { NextRequest, NextResponse } from "next/server";
import { SessionStatus } from "./lib/types/types";
import { getAppRoute } from "./lib/utils";
import { getUserSessionStatus } from "./app/actions/auth";

export async function middleware(req: NextRequest) {
	if (req.url.startsWith(getAppRoute("error"))) {
		return NextResponse.redirect(getAppRoute(""));
	}

	const isOffline = await fetch(`${process.env.API_URL}/api/v1/ping`)
		.then(() => false)
		.catch(() => true);

	if (isOffline) {
		return NextResponse.rewrite(getAppRoute("error"));
	}

	try {
		const sessionStatus = await getUserSessionStatus();
		console.log(sessionStatus);

		if (
			req.url.startsWith(getAppRoute("dashboard")) &&
			sessionStatus == SessionStatus.NO_SESSION
		) {
			return NextResponse.redirect(getAppRoute("register"));
		} else if (
			[getAppRoute("login"), getAppRoute("register")].includes(req.url) &&
			sessionStatus == SessionStatus.AUTHENTICATED
		) {
			return NextResponse.redirect(getAppRoute("dashboard"));
		}
		return NextResponse.next();
	} catch (err) {
		console.log(err);
		return NextResponse.rewrite(getAppRoute("error"));
	}
}

export const config = {
	matcher: ["/login", "/register", "/dashboard/:path*", "/error"],
};
