import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getUserSessionStatus(): Promise<
	SessionStatus | undefined
> {
	try {
		const response = await fetch(
			`${process.env.API_URL}/api/v1/users/current`,
			{
				cache: "no-cache",
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
