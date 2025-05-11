import { getAppRoute, getFullShortenedUrl, getUrlHostname } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { ShortenedUrl } from "@/lib/types/api";
import Link from "next/link";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import ClipboardButton from "./clipboard-button";
import ShareDialog from "./share-button";

type Props = {
	url: ShortenedUrl;
};

export default function UrlCard({ url }: Props) {
	return (
		<Card key={url.id} className="gap-2 p-3">
			<CardHeader className="m-0 flex w-full flex-row items-start justify-start gap-2 p-0">
				<div className="flex flex-col">
					<div className="flex w-full flex-row items-center justify-start gap-2">
						{url.metadata?.image && (
							<Image
								alt={
									url.metadata?.title ||
									getUrlHostname(url.originalUrl)
								}
								src={url.metadata!.image}
								height={24}
								width={24}
							/>
						)}
						<CardTitle>
							{url.metadata?.title ||
								getUrlHostname(url.originalUrl)}
						</CardTitle>
					</div>
					<Link
						href={url.originalUrl}
						className="group text-primary/70 text-md hover:text-primary m-0 p-0 hover:underline"
					>
						{url.originalUrl}
					</Link>
				</div>

				<Link href={`dashboard/${url.id}`} passHref className="ms-auto">
					<Button size="icon" className="p-2" variant="outline">
						<Edit className="scale-120" />
					</Button>
				</Link>
				<ClipboardButton text={getAppRoute(url.id)} />
				<ShareDialog shareUrl={getAppRoute(url.id)} />
			</CardHeader>
			<CardContent className="m-0 flex w-fit flex-col p-0">
				<Link
					href={`/${url.id}`}
					className="group m-0 w-auto p-0 hover:underline"
				>
					{getFullShortenedUrl(url.id)}
				</Link>
			</CardContent>
		</Card>
	);
}
