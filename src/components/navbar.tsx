import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import AppLogo from "./logo";
import { cn } from "@/lib/utils";
import { getUserSessionStatus } from "../app/[locale]/actions/auth";
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
import { getTranslations } from "next-intl/server";
import { LanguageChanger } from "./language-changer";
import Image from "next/image";

type MenuEntry = {
	label: string;
	href: string;
};

export default async function AppNavbar({ locale }: { locale: string }) {
	const sessionStatus = await getUserSessionStatus().catch(
		() => SessionStatus.NO_SESSION,
	);
	const t = await getTranslations("navbar");
	const miscMsg = await getTranslations("misc");

	const navigationMenuEntries: MenuEntry[] = [
		{
			label: t("links.home"),
			href: "/",
		},
		{
			label: t("links.pricing"),
			href: "/pricing",
		},
		{
			label: t("links.contact"),
			href: "/contact",
		},
		{ label: t("links.faq"), href: "/faq" },
	];

	const registerButtons =
		sessionStatus == SessionStatus.AUTHENTICATED ? (
			<>
				<Link href="/dashboard" passHref>
					<Button className="w-full">{t("buttons.dashboard")}</Button>
				</Link>
			</>
		) : (
			<>
				<Link href="/register" passHref>
					<Button className="w-full">{t("buttons.register")}</Button>
				</Link>
				<Link href="/login" passHref>
					<Button variant="ghost" className="w-full">
						{t("buttons.login")}
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
					<div className="flex-column ms-3 me-auto flex items-center space-x-1 max-md:hidden">
						<ModeToggle />
						<LanguageChanger className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
							<Button
								variant="ghost"
								className="aspect-square h-10 overflow-hidden p-0"
							>
								{locale == "pt" ? (
									<Image
										width={32}
										height={32}
										className="aspect-square h-full overflow-hidden object-contain"
										alt="Português"
										src="/brazil.svg"
									/>
								) : (
									<Image
										width={32}
										height={32}
										className="aspect-square h-full overflow-hidden object-contain"
										alt="English"
										src="/usa.svg"
									/>
								)}
							</Button>
						</LanguageChanger>
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
							<SheetFooter>
								<div className="m-0 hidden w-full list-none flex-col gap-2 p-0 max-sm:flex">
									{registerButtons}
								</div>
								<hr className="my-2" />
								<LanguageChanger className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
									<Button variant="outline">
										{locale == "pt" ? (
											<Image
												width={32}
												height={32}
												className="aspect-square h-full overflow-hidden object-contain"
												alt="Português"
												src="/brazil.svg"
											/>
										) : (
											<Image
												width={32}
												height={32}
												className="aspect-square h-full overflow-hidden object-contain"
												alt="English"
												src="/usa.svg"
											/>
										)}
										{locale == "pt" ? (
											<span>Português</span>
										) : (
											<span>English</span>
										)}
									</Button>
								</LanguageChanger>
								<ModeToggle className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
									<Button variant="outline">
										<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
										<Moon className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
										<span className="dark:hidden">
											{miscMsg("light_mode")}
										</span>
										<span className="not-dark:hidden">
											{miscMsg("dark_mode")}
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
