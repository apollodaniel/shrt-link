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
import { SessionStatus } from "@/lib/types/types";
import { ModeToggle } from "./mode-toggle";
import {
	SheetContent,
	Sheet,
	SheetHeader,
	SheetClose,
	SheetTrigger,
	SheetFooter,
	SheetTitle,
} from "./ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";

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

	const registerButtons =
		sessionStatus == SessionStatus.AUTHENTICATED ? (
			<>
				<Link href="/dashboard" passHref>
					<Button className="w-full">Dashboard</Button>
				</Link>
			</>
		) : (
			<>
				<Link href="/register" passHref>
					<Button className="w-full">Register now</Button>
				</Link>
				<Link href="/login" passHref>
					<Button variant="ghost" className="w-full">
						Sign in
					</Button>
				</Link>
			</>
		);

	return (
		<div className="fixed top-0 flex w-full flex-row items-center justify-between px-6 backdrop-blur-xl">
			<AppLogo />
			<NavigationMenu className="h-16">
				<NavigationMenuList>
					<div className="flex flex-row max-md:hidden">
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
					</div>
					<div className="ms-2 flex list-none flex-row gap-2 max-sm:hidden">
						{registerButtons}
					</div>

					<div className="max-md:hidden">
						<ModeToggle />
					</div>

					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								className="hidden aspect-square size-10 items-center justify-center max-md:flex"
							>
								<Menu className="scale-130" />
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle className="text-2xl">
									Menu
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-1 p-3">
								{navigationMenuEntries.map(
									({ label, href }) => (
										<SheetClose asChild key={label}>
											<Link href={href} passHref>
												<Button
													variant="ghost"
													className="text-md bg-secondary flex w-full justify-start py-5"
												>
													{label}
												</Button>
											</Link>
										</SheetClose>
									),
								)}
							</div>
							<SheetFooter className="gap-4">
								<div className="m-0 hidden w-full list-none flex-col gap-2 p-0 max-sm:flex">
									{registerButtons}
								</div>
								<hr />
								<ModeToggle className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
									<Button variant="outline">
										<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
										<Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
										<span className="dark:hidden">
											Light mode
										</span>
										<span className="not-dark:hidden">
											Dark mode
										</span>
									</Button>
								</ModeToggle>
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
