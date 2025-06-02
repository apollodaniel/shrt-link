"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ShareUrlDialog from "./share-url-dialog";
import { useTranslations } from "next-intl";

type Props = {
	shareUrl: string;
};

export default function ShareUrlButton({ shareUrl }: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const t = useTranslations("misc.url_card");

	return (
		<>
			<Button variant="outline" onClick={() => setIsDialogOpen(true)}>
				{t("share_button_label")}
			</Button>
			<ShareUrlDialog
				shareUrl={shareUrl}
				isOpen={isDialogOpen}
				setIsOpen={(open) => setIsDialogOpen(open)}
			/>
		</>
	);
}
