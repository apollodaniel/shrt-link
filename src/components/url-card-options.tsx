"use client";

import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ShortenedUrl } from "@/lib/types/api";
import Link from "next/link";
import { getAppRoute } from "@/lib/utils";
import { useState } from "react";
import ShareUrlDialog from "./share-url-dialog";
import { useTranslations } from "next-intl";

type Props = {
	url: ShortenedUrl;
	className?: string;
};

export default function UrlCardOptions({ url, className }: Props) {
	const [isShareUrlOpen, setIsShareUrlOpen] = useState(false);
	const t = useTranslations("misc.url_card.card_options");

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(getAppRoute(url.id));
	};

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" className="p-2" variant="outline">
						<Settings className="scale-120" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
					<Link href={getAppRoute(`dashboard/${url.id}`)} passHref>
						<DropdownMenuItem>{t("edit")}</DropdownMenuItem>
					</Link>
					<DropdownMenuItem onClick={copyToClipboard}>
						{t("copy")}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsShareUrlOpen(true)}>
						{t("share_url")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<ShareUrlDialog
				shareUrl={getAppRoute(url.id)}
				isOpen={isShareUrlOpen}
				setIsOpen={(open) => setIsShareUrlOpen(open)}
			/>
		</div>
	);
}
