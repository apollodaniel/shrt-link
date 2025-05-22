"use server";

import { cookies } from "next/headers";

type ServerFetchInput = Parameters<typeof fetch>[0];
export type ServerRequestInit = {
	includeTokens?: boolean;
} & RequestInit;

export async function fetchServer(
	input: ServerFetchInput,
	init?: ServerRequestInit,
) {
	let parsedInit: RequestInit = { ...init };
	if (init?.includeTokens && !init?.headers) {
		const _cookies = await cookies();
		if (!_cookies.has("refreshToken")) {
			throw new Error("No cookie found for refreshToken");
		}

		const authTokenCookie = _cookies.has("authToken")
			? `;authToken=${_cookies.get("authToken")!.value}`
			: "";
		parsedInit = {
			...init,
			headers: {
				Cookie: `refreshToken=${_cookies.get("refreshToken")!.value}${authTokenCookie}`,
			},
		};
	}

	const response = await fetch(input, parsedInit);

	return response;
}
