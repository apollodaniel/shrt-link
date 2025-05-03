import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import AppLogo from "./logo";
import { cn } from "@/lib/utils";

type MenuEntry = {
	label: string;
	href: string;
};

const navigationMenuEntries: MenuEntry[] = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Pricing",
		href: "/",
	},
	{
		label: "Contact",
		href: "/",
	},
	{ label: "FAQ", href: "/" },
];

export default function AppNavbar() {
	return (
		<div className="fixed top-0 flex w-full flex-row items-center justify-between px-6">
			<AppLogo />
			<NavigationMenu className="h-16">
				<NavigationMenuList>
					{navigationMenuEntries.map(({ label, href }) => (
						<NavigationMenuItem key={label}>
							<Link
								href={href}
								className={cn(
									navigationMenuTriggerStyle(),
									"text-md",
								)}
							>
								{label}
							</Link>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
