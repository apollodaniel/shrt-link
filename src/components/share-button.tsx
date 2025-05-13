"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ShareUrlDialog from "./share-url-dialog";

type Props = {
	shareUrl: string;
};

export default function ShareUrlButton({ shareUrl }: Props) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<Button variant="outline" onClick={() => setIsDialogOpen(true)}>
				Share Link
			</Button>
			<ShareUrlDialog
				shareUrl={shareUrl}
				isOpen={isDialogOpen}
				setIsOpen={(open) => setIsDialogOpen(open)}
			/>
		</>
	);
}
