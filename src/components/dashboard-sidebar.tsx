import { CirclePlus, Home, Link, Moon, Sun } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import UserDropdownMenu from "./user-dropdown-menu";
import { getUser } from "@/app/[locale]/actions/dashboard/dashboard";
import { User } from "@/lib/types/api";
import AddUrlDialog from "./add-url-dialog";
import { ModeToggle } from "./mode-toggle";
import { getTranslations } from "next-intl/server";

export default async function DashboardSidebar() {
	let user: User | undefined;
	try {
		user = await getUser({
			cache: "force-cache",
			next: {
				tags: ["user"],
			},
		});
	} catch (err) {
		console.log(err);
	}
	const miscT = await getTranslations("misc");
	const t = await getTranslations("dashboard_sidebar");

	const items = [
		{
			label: t("title"),
			items: [
				{
					title: t("home"),
					url: "/dashboard",
					icon: Home,
				},
				{
					title: t("url_list"),
					url: "/dashboard/list",
					icon: Link,
				},
			],
		},
	];

	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				{items.map((i) => (
					<SidebarGroup key={i.label}>
						<SidebarGroupLabel>{i.label}</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{i.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild>
											<a href={item.url}>
												<item.icon />
												<span>{item.title}</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
								<SidebarMenuItem>
									<AddUrlDialog>
										<SidebarMenuButton>
											<CirclePlus />
											<span>{t("add_url.label")}</span>
										</SidebarMenuButton>
									</AddUrlDialog>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			{user && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<ModeToggle className="mx-auto w-[var(--global-sidebar-width)] max-w-[90%]">
								<SidebarMenuButton>
									<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
									<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
									<span className="dark:hidden">
										{miscT("light_mode")}
									</span>
									<span className="not-dark:hidden">
										{miscT("dark_mode")}
									</span>
								</SidebarMenuButton>
							</ModeToggle>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<UserDropdownMenu user={user} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
