"use server";

import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { fetchServer } from "../server";
import { User } from "@/lib/types/api";

export async function getUser(): Promise<User> {
	const response = await fetchServer(getAppRoute("api/v1/users/current"), {
		includeTokens: true,
	});
	const text = await response.text();

	if (response.status == 200) return JSON.parse(text, jsonDateReviver);

	throw new Error(`${response.status} - ${text}`);
}
