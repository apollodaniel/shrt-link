"use client";

import * as React from "react";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

type Props = {
	children?: React.ReactNode;
	className?: string;
};

export function LanguageChanger({ children, className }: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const [, startTransition] = React.useTransition();

	const changeLocale = (locale: string) => {
		const pathParts = pathname.split("/");
		pathParts[1] = locale; // assuming locale is the first part of the path
		const newPath = pathParts.join("/");

		startTransition(() => {
			router.replace(newPath);
		});
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children ? (
					children
				) : (
					<Button variant="ghost" size="icon">
						<Languages className="h-[1.2rem] w-[1.2rem]" />
						<span className="sr-only">Change language</span>
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className={className}>
				<DropdownMenuItem onClick={() => changeLocale("en")}>
					<Image
						width={18}
						height={18}
						className="aspect-square h-full overflow-hidden object-contain"
						alt="English"
						src="/usa.svg"
					/>
					English
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLocale("pt")}>
					<Image
						width={18}
						height={18}
						className="aspect-square h-full overflow-hidden object-contain"
						alt="Português"
						src="/brazil.svg"
					/>
					Português
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
