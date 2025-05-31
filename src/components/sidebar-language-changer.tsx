"use client";
import { cn } from "@/lib/utils";
import { LanguageChanger } from "./language-changer";
import { SidebarMenuButton, useSidebar } from "./ui/sidebar";
import Image from "next/image";

export default function SidebarLanguageChanger({ locale }: { locale: string }) {
	const { state } = useSidebar();
	return (
		<LanguageChanger className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
			<SidebarMenuButton
				className={cn(
					"flex flex-row items-center",
					state == "collapsed" ? "justify-center" : "justify-start",
				)}
			>
				<div
					className={cn(
						"h-5 max-w-8 min-w-5 overflow-hidden rounded-[4px]",
						state == "collapsed" ? "me-auto" : "",
					)}
				>
					{locale === "pt" ? (
						<Image
							width={20}
							height={20}
							className="h-full w-full object-contain"
							alt="Português"
							src="/brazil.svg"
						/>
					) : (
						<Image
							width={20}
							height={20}
							className="h-full w-full object-contain"
							alt="English"
							src="/usa.svg"
						/>
					)}
				</div>

				{state != "collapsed" &&
					(locale == "pt" ? (
						<span className="truncate">Português</span>
					) : (
						<span className="truncate">English</span>
					))}
			</SidebarMenuButton>
		</LanguageChanger>
	);
}
