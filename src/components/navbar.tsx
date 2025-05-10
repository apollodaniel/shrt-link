import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import AppLogo from "./logo";
import { cn } from "@/lib/utils";
import { getUserSessionStatus } from "../app/actions/auth";
import { Button } from "./ui/button";
import { SessionStatus } from "@/lib/types";

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
		href: "/pricing",
	},
	{
		label: "Contact",
		href: "/contact",
	},
	{ label: "FAQ", href: "/faq" },
];

export default async function AppNavbar() {
	const sessionStatus = await getUserSessionStatus().catch(
		() => SessionStatus.NO_SESSION,
	);

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
					{sessionStatus == SessionStatus.AUTHENTICATED ? (
						<>
							<Link href="/dashboard" passHref className="ms-2">
								<Button>Dashboard</Button>
							</Link>
						</>
					) : (
						<>
							<Link href="/register" passHref className="ms-2">
								<Button>Register now</Button>
							</Link>
							<NavigationMenuItem>
								<Link
									href={"/login"}
									className={cn(navigationMenuTriggerStyle())}
								>
									Sign in
								</Link>
							</NavigationMenuItem>
						</>
					)}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
