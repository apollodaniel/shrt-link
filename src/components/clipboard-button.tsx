"use client";

import { Check, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type Props = {
	text: string;
};

export default function ClipboardButton({ text }: Props) {
	const [isConfirmCopyIcon, setIsConfirmCopyIcon] = useState(false);

	const copyToClipboard = async () => {
		if (!isConfirmCopyIcon) {
			await navigator.clipboard.writeText(text);
			setIsConfirmCopyIcon(true);
			setTimeout(() => setIsConfirmCopyIcon(false), 2000);
		}
	};

	return (
		<Button
			size="icon"
			className="cursor-pointer p-2"
			onClick={() => copyToClipboard()}
			variant="outline"
		>
			{isConfirmCopyIcon ? (
				<Check className="scale-120" />
			) : (
				<Copy className="scale-120" />
			)}
		</Button>
	);
}
