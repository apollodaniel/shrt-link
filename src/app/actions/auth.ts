"use server";

import { SessionStatus } from "@/lib/types/types";
import { fetchServer } from "./server";
import { getAppRoute } from "@/lib/utils";

export async function getUserSessionStatus(): Promise<
	SessionStatus | undefined
> {
	try {
		const response = await fetchServer(
			getAppRoute("api/v1/users/current"),
			{
				includeTokens: true,
			},
		);

		console.log(response.status);
		if (response.status >= 200 && response.status < 300)
			return SessionStatus.AUTHENTICATED;
		else if (response.status == 401) return SessionStatus.NO_SESSION;
	} catch (err) {
		if (
			(err.message as string).includes("No cookie found for refreshToken")
		) {
			return SessionStatus.NO_SESSION;
		}
		throw err;
	}
}
