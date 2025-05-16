import { clsx, type ClassValue } from "clsx";
import { ErrorOption } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FormattedFieldError, FieldError, ErrorEntry } from "./types/error";
import { ExternalToast } from "sonner";
import { redirect } from "next/navigation";
import { ShortenedUrl, ShortenedUrlStatistic } from "./types/api";
import { DateChartData, DateStringChartData } from "./types/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAppRoute = (route: string): string =>
	`${process.env.NEXT_PUBLIC_APP_URL}/${route}`;

export const getFullShortenedUrl = (urlId: string) =>
	getAppRoute(urlId).replace(/http[s]?\:\/\//, "");

export const getUrlHostname = (url: string) =>
	url.replace(/^http[s]?\:\/\/([^:\/]+).*$/, "$1");

export const parseError = <T extends string>(
	responseText: string,
	formSetErrorCallback?: (field: T, message: ErrorOption) => void,
	toastCallback?: (message: string, opts: ExternalToast) => void,
) => {
	const json = JSON.parse(responseText);

	if (Object.hasOwn(json, "fieldErrors")) {
		const errors: FieldError[] = json.fieldErrors;

		const formattedErrors = formatFieldErrors(errors);

		for (const formError of formattedErrors) {
			if (formSetErrorCallback)
				formSetErrorCallback(formError.path as T, {
					message: formError.messages.join(", "),
				});
		}
	} else {
		const errorEntry: ErrorEntry = json;
		if (errorEntry.field) {
			if (formSetErrorCallback)
				formSetErrorCallback(errorEntry.field as T, {
					message: errorEntry.message,
				});
		} else {
			if (toastCallback)
				toastCallback(errorEntry.message, {
					richColors: true,
				});
		}
	}
};

export function formatFieldErrors(
	fieldErrors: FieldError[],
): FormattedFieldError[] {
	const result: Record<string, string[]> = {};

	fieldErrors.forEach((error) => {
		if (!result[error.path]) {
			result[error.path] = [];
		}
		const capMsg = [error.msg[0].toUpperCase(), error.msg.slice(1)].join(
			"",
		);
		result[error.path].push(capMsg);
	});

	return Object.entries(result).map(([path, messages]) => ({
		path,
		messages,
	}));
}

type RedirectLocationFunction = (body: string) => string | undefined;

export async function onSubmit<T>({
	path,
	formFields,
	onError,
	redirect_location,
}: {
	path: string;
	formFields: T;
	onError?: (response: Response) => void;
	redirect_location: string | undefined | RedirectLocationFunction;
}) {
	const data = formFields;
	const response = await fetch(path, {
		method: "POST",
		credentials: "same-origin",
		body: JSON.stringify(data),
		headers: {
			"Content-type": "application/json",
		},
	});

	if (response.status == 200) {
		if (typeof redirect_location == "string") {
			redirect(redirect_location || "/dashboard");
		} else if (redirect_location) {
			const url = redirect_location(await response.text());
			if (url) redirect(url);
		}
	} else {
		if (onError) onError(response);
	}
}

export async function checkFavicon(url: string): Promise<boolean> {
	return await fetch(`${url}/favicon.ico`).then(
		(response) => response.status == 200,
		() => false,
	);
}

export function jsonDateReviver<T>(key: string, value: T): T | Date {
	if (
		(key.endsWith("Date") || key.endsWith("Time") || key == "day") &&
		typeof value === "string"
	) {
		return new Date(value);
	}
	return value;
}
export function dashboardJsonDateReviver(key: string, value: unknown): unknown {
	if (
		!(key == "yearVisitors" || key == "lastSixMonthVisitor") &&
		Array.isArray(value) &&
		value.every(
			(v) => typeof v.date == "string" && typeof v.count == "number",
		)
	) {
		return value.map((v: DateStringChartData): DateChartData => {
			return {
				...v,
				date: new Date(v.date),
			};
		});
	}
	return value;
}

export function getLatestStatistic(url: ShortenedUrl): ShortenedUrlStatistic {
	return url.statistics.sort(
		(a, b) => b.accessTime.getTime() - a.accessTime.getTime(),
	)[0];
}
