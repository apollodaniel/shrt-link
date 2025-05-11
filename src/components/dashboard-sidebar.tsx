import { Home, Link } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import UserDropdownMenu from "./user-dropdown-menu";
import { getUser } from "@/app/actions/dashboard/dashboard";
import { User } from "@/lib/types/api";

const items = [
	{
		label: "Application",
		items: [
			{
				title: "Home",
				url: "/dashboard",
				icon: Home,
			},
			{
				title: "Links",
				url: "/dashboard/list",
				icon: Link,
			},
		],
	},
];

export default async function DashboardSidebar() {
	let user: User | undefined;
	try {
		user = await getUser();
	} catch (err) {
		console.log(err);
	}

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader />
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
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			{user && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<UserDropdownMenu user={user} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}
		</Sidebar>
	);
}
