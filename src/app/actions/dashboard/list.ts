import { getAppRoute, jsonDateReviver } from "@/lib/utils";
import { fetchServer } from "../server";
import { getUrlMetadata } from "./dashboard";
import { ShortenedUrl } from "@/lib/types/api";

export async function getUrlList(
	cache?: RequestCache,
): Promise<ShortenedUrl[]> {
	const response = await fetchServer(getAppRoute("api/v1/urls/"), {
		includeTokens: true,
		cache,
	});
	const text = await response.text();

	if (response.status == 200) {
		const rawList: ShortenedUrl[] = JSON.parse(text, jsonDateReviver);

		return await Promise.all(
			rawList.map(async (item) => {
				const metadata = await getUrlMetadata(item).catch(
					() => undefined,
				);

				return {
					...item,
					metadata,
				};
			}),
		);
	}

	throw new Error(`${response.status} - ${text}`);
}
