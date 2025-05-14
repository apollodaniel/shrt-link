import {
	cn,
	getAppRoute,
	getFullShortenedUrl,
	getUrlHostname,
} from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { ShortenedUrl } from "@/lib/types/api";
import Link from "next/link";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";
import ClipboardButton from "./clipboard-button";
import { Checkbox } from "./ui/checkbox";
import ShareUrlButton from "./share-button";
import UrlCardOptions from "./url-card-options";

type Props = {
	isMinimal?: boolean;
	isSelected?: boolean;
	setIsSelected?: (id: string, checked: boolean) => void;
	url: ShortenedUrl;
};

export default function UrlCard({
	url,
	isMinimal = false,
	isSelected,
	setIsSelected,
}: Props) {
	return (
		<Card className="w-full gap-2 p-3">
			<CardContent className="m-0 flex w-auto max-w-[100%] flex-row gap-3 p-0">
				{typeof isSelected != "undefined" && (
					<Checkbox
						className="h-5 w-5"
						checked={isSelected}
						onCheckedChange={
							setIsSelected
								? (value) =>
										setIsSelected(
											url.id,
											value ? true : false,
										)
								: undefined
						}
					/>
				)}
				<div className="flex w-full flex-row items-start justify-between">
					<div className="flex flex-col">
						<div className="flex max-w-[50vw] flex-row items-center justify-start gap-2 truncate">
							{url.metadata?.image && (
								<Image
									alt={
										url.metadata?.title ||
										getUrlHostname(url.originalUrl)
									}
									src={url.metadata!.image}
									height={24}
									width={24}
									className="aspect-square h-[24px] w-[24px] object-cover"
								/>
							)}

							{url.metadata?.title ||
								getUrlHostname(url.originalUrl)}
						</div>
						<Link
							href={url.originalUrl}
							className="group text-primary/70 text-md hover:text-primary m-0 max-w-[50vw] truncate p-0 hover:underline"
						>
							{url.originalUrl}
						</Link>

						<Link
							href={`/${url.id}`}
							className="group m-0 mt-3 max-h-full w-auto max-w-[50vw] truncate p-0 hover:underline"
						>
							{getFullShortenedUrl(url.id)}
						</Link>
					</div>

					<UrlCardOptions
						url={url}
						className={cn(!isMinimal ? "hidden max-sm:block" : "")}
					/>
					<div
						className={cn(
							"flex flex-row items-center gap-2",
							isMinimal ? "hidden" : "max-sm:hidden",
						)}
					>
						<Link
							href={getAppRoute(`dashboard/${url.id}`)}
							passHref
						>
							<Button
								size="icon"
								className="p-2"
								variant="outline"
							>
								<Edit className="scale-120" />
							</Button>
						</Link>
						<ClipboardButton text={getAppRoute(url.id)} />
						<ShareUrlButton shareUrl={getAppRoute(url.id)} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
