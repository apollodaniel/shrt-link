"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";

type Props = {
	children?: React.ReactNode;
	className?: string;
};

export function ModeToggle({ children, className }: Props) {
	const { setTheme } = useTheme();
	const t = useTranslations("misc");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children ? (
					children
				) : (
					<Button variant="ghost" size="icon">
						<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
						<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className={className}>
				<DropdownMenuItem onClick={() => setTheme("light")}>
					{t("light_mode")}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					{t("dark_mode")}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					{t("system_mode")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
