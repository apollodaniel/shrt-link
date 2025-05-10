"use server";

import { cookies } from "next/headers";

type ServerFetchInput = Parameters<typeof fetch>[0];
type ServerRequestInit = {
	includeTokens?: boolean;
} & Omit<Omit<RequestInit, "credentials">, "headers">;

export async function fetchServer(
	input: ServerFetchInput,
	init?: ServerRequestInit,
) {
	let parsedInit: RequestInit = init || {};
	if (init?.includeTokens) {
		const _cookies = await cookies();
		if (!_cookies.has("refreshToken") || !_cookies.has("authToken")) {
			throw new Error("No cookie found for refreshToken or authToken");
		}

		parsedInit = {
			...init,
			headers: {
				Cookie: `refreshToken=${_cookies.get("refreshToken")!.value};authToken=${_cookies.get("authToken")!.value}`,
			},
		};
	}

	return fetch(input, parsedInit);
}
