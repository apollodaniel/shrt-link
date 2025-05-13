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

type Props = {
	url: ShortenedUrl;
	className?: string;
};

export default function UrlCardOptions({ url, className }: Props) {
	const [isShareUrlOpen, setIsShareUrlOpen] = useState(false);

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" className="p-2" variant="outline">
						<Settings className="scale-120" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Options</DropdownMenuLabel>
					<Link href={getAppRoute(`dashboard/${url.id}`)} passHref>
						<DropdownMenuItem>Edit</DropdownMenuItem>
					</Link>
					<DropdownMenuItem>Copy</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsShareUrlOpen(true)}>
						Share url
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
