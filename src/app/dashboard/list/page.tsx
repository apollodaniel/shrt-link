import { getUrlList } from "@/app/actions/dashboard/list";
import UrlList from "@/components/url-list";
import { ShortenedUrl } from "@/lib/types/api";

export default async function DashboardList() {
	let urlList: ShortenedUrl[] = [];
	try {
		urlList = await getUrlList();
	} catch (err) {
		console.log(err);
	}

	return (
		<main className="space-y-6">
			<h1 className="text-4xl font-bold">URL List</h1>
			<UrlList urlList={urlList} />
		</main>
	);
}
