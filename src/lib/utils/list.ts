import { revalidateSummary } from "@/app/[locale]/actions/dashboard/dashboard";
import { getAppRoute } from "../utils";
import { ShortenedUrl } from "../types/api";
import { SearchSettings } from "../types/types";
import { DateRange } from "react-day-picker";

export function processSearch(search: string, url: ShortenedUrl) {
	return (
		url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
		url.metadata?.title?.toLowerCase().includes(search.toLowerCase())
	);
}

export function filterByDate(
	urlList: ShortenedUrl[],
	rangeDate?: DateRange,
): ShortenedUrl[] {
	const getDays = (date: Date) =>
		Math.round(date.getTime() / 1000 / 60 / 60 / 24);
	if (!rangeDate) return urlList;
	return urlList.filter((url) => {
		const creationDays = getDays(url.creationDate);
		const fromDays = rangeDate.from ? getDays(rangeDate.from) : 0;
		const toDays = rangeDate.to
			? getDays(rangeDate.to)
			: getDays(new Date(Date.now()));
		const isBefore = creationDays <= toDays;
		const isAfter = creationDays >= fromDays;
		return isBefore && isAfter;
	});
}

export function filterBySettings(
	urlList: ShortenedUrl[],
	settings?: SearchSettings,
): ShortenedUrl[] {
	if (!settings) return urlList;

	return (
		urlList
			// filter if is active
			.filter((url) =>
				settings.isActive
					? url.statistics.find(
							(s) =>
								Date.now() - s.accessTime.getTime() <
								24 * 60 * 60 * 1000,
						)
					: true,
			)
			// short by order settings
			.sort((a, b) => {
				if (settings.order?.by == "Creation Date") {
					// url.creationDate.get
					const bTime = b.creationDate.getTime();
					const aTime = a.creationDate.getTime();

					return settings.order.order == "DESC"
						? bTime - aTime
						: aTime - bTime;
				} else {
					return settings.order?.order == "DESC"
						? b.id.localeCompare(a.id)
						: a.id.localeCompare(b.id);
				}
			})
	);
}

export async function deleteMultipleUrls(
	urlList: string[],
): Promise<{ urlId: string; error: string }[]> {
	const detailedRelatory: { urlId: string; error: string }[] = [];
	for (const url of urlList) {
		try {
			const response = await fetch(getAppRoute(`api/v1/urls/${url}`), {
				method: "DELETE",
				credentials: "include",
			});

			if (response.status != 200)
				throw new Error(
					`Unable to delete url: ${JSON.stringify(
						{
							status: response.status,
							body: response.body,
						},
						null,
						2,
					)}`,
				);
		} catch (err) {
			console.log(err);
			detailedRelatory.push({
				urlId: url,
				error: err instanceof Error ? err.message : "Unknown error",
			});
		}
	}

	revalidateSummary();
	return detailedRelatory;
}
