import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getUserSessionStatus(): Promise<SessionStatus> {
	const response = await fetch(
		`${process.env.API_URL}/api/v1/users/current`,
		{
			cache: "no-cache",
		},
	);

	if (response.status == 401) {
		return SessionStatus.NO_SESSION;
	} else if (response.status >= 200 && response.status < 300) {
		return SessionStatus.AUTHENTICATED;
	}

	const responseText = await response.text();

	throw new Error(`Unable to get user session status: ${responseText}`);
}
