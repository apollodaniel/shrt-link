"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type Props = {
	shareUrl: string;
};

export default function ShareDialog({ shareUrl }: Props) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const shareViaSocialMedia = (url: string) => {
		copyToClipboard();
		window.open(url, "_blank");
	};

	const shareViaEmail = () => {
		window.open(
			`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`,
			"_blank",
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Share Link</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-md"
				onOpenAutoFocus={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>Share link</DialogTitle>
					<DialogDescription>
						Share this link with others via copy or social media.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="link">Link</Label>
							<Input id="link" value={shareUrl} readOnly />
						</div>
						<Button
							size="sm"
							className="self-end px-3"
							onClick={copyToClipboard}
						>
							<span className="sr-only">Copy</span>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>

					<div className="space-y-2">
						<Label>Share via</Label>
						<div className="flex justify-center space-x-4 pt-2">
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									shareViaSocialMedia("https://x.com/")
								}
								className="h-10 w-10"
							>
								<Image
									alt="x icon"
									height={20}
									width={20}
									src="/x.svg"
								/>
								<span className="sr-only">Share on X</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									shareViaSocialMedia("https://facebook.com/")
								}
								className="h-10 w-10"
							>
								<Image
									alt="facebook icon"
									height={20}
									width={20}
									src="/facebook.svg"
								/>
								<span className="sr-only">
									Share on Facebook
								</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={shareViaEmail}
								className="h-10 w-10"
							>
								<Mail className="scale-130" />
								<span className="sr-only">Share via Email</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() =>
									shareViaSocialMedia(
										"https://instagram.com/",
									)
								}
								className="h-10 w-10"
							>
								<Image
									alt="instagram icon"
									height={20}
									width={20}
									src="/instagram.svg"
								/>
								<span className="sr-only">
									Share via instagram
								</span>
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
