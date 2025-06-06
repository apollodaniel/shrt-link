"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import Image from "next/image";
import { Check, Copy, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";

type Props = {
	shareUrl: string;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
};

export default function ShareUrlDialog({ shareUrl, isOpen, setIsOpen }: Props) {
	const [copied, setCopied] = useState(false);
	const t = useTranslations("misc.url_card.share_url_dialog");

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
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent
				className="sm:max-w-md"
				onOpenAutoFocus={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="link">{t("input_label")}</Label>
							<Input id="link" value={shareUrl} readOnly />
						</div>
						<Button
							size="sm"
							className="self-end px-3"
							onClick={copyToClipboard}
						>
							<span className="sr-only">{t("copy_label")}</span>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>

					<div className="space-y-2">
						<Label>{t("share_label")}</Label>
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
									className="dark:invert"
									src="/x.svg"
								/>
								<span className="sr-only">{t("x_label")}</span>
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
									className="dark:invert"
									width={20}
									src="/facebook.svg"
								/>
								<span className="sr-only">
									{t("facebook_label")}
								</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={shareViaEmail}
								className="h-10 w-10"
							>
								<Mail className="scale-130" />
								<span className="sr-only">
									{t("mail_label")}
								</span>
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
									className="dark:invert"
								/>
								<span className="sr-only">
									{t("instagram_label")}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
