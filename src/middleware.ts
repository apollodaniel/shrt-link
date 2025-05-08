import { NextRequest, NextResponse } from "next/server";
import { SessionStatus } from "./lib/types";
import { getUserSessionStatus } from "./lib/utils";

const getAppRoute = (route: string): string =>
	`${process.env.APP_URL}/${route}`;

export async function middleware(req: NextRequest) {
	const sessionStatus = await getUserSessionStatus();

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
}

export const config = {
	matcher: ["/login", "/register", "/dashboard/:path*"],
};
