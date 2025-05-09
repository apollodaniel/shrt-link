"use server";

import { SessionStatus } from "@/lib/types";
import { cookies } from "next/headers";

export async function getUserSessionStatus(): Promise<
	SessionStatus | undefined
> {
	const _cookies = await cookies();
	if (!_cookies.has("refreshToken") || !_cookies.has("authToken")) {
		return SessionStatus.NO_SESSION;
	}

	const authorization = `refreshToken=${_cookies.get("refreshToken")!.value};authToken=${_cookies.get("authToken")!.value}`;

	try {
		const response = await fetch(
			`${process.env.APP_URL}/api/v1/users/current`,
			{
				headers: {
					Cookie: authorization,
				},
			},
		);

		if (response.status >= 200 && response.status < 300)
			return SessionStatus.AUTHENTICATED;
		else if (response.status == 401) return SessionStatus.NO_SESSION;
	} catch (err) {
		console.log(err);
		throw err;
	}
}
