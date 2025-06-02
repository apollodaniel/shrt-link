"use client";

import { ReactNode, useState } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

type Props = {
	icons: ReactNode[];
};

export default function ContactMessage({ icons }: Props) {
	const [isInvalidMessage, setIsInvalidMessage] = useState(false);
	const [mailBody, setMailBody] = useState("");
	const t = useTranslations("landing_contact.field");

	return (
		<>
			<CardContent className="space-y-1">
				<Label htmlFor="message">{t("label")}</Label>
				<Textarea
					id="message"
					onChange={(e) => {
						setIsInvalidMessage(e.target.value.length == 0);
						setMailBody(e.target.value);
					}}
					className="h-32 max-h-32"
				/>
				{isInvalidMessage && (
					<p className="text-destructive text-sm">
						{t("error_message")}
					</p>
				)}
			</CardContent>

			<CardFooter className="flex flex-row flex-wrap items-center justify-center gap-5 gap-y-3">
				<Button
					className="w-full"
					color={isInvalidMessage ? "secondary" : "default"}
					disabled={isInvalidMessage}
					onClick={() => {
						if (mailBody.length == 0 && !isInvalidMessage) {
							setIsInvalidMessage(true);
						} else if (mailBody.length > 0) {
							window.open(
								`mailto:developer.apollo.mail@gmail.com?subject=shrt link&body=${mailBody}`,
							);
						}
					}}
				>
					{t("submit_button")}
				</Button>
				{icons}
			</CardFooter>
		</>
	);
}
