import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
	children,
}: {
	children: ReactNode[];
}) {
	return (
		<div className="max-h-[100vh]">
			<SidebarProvider
				style={{
					"--sidebar-width": "var(--global-sidebar-width)",
					"--sidebar-width-mobile":
						"var(--global-sidebar-width-mobile)",
				}}
				defaultOpen={false}
			>
				<DashboardSidebar />

				<main className="max-h-[100vh] w-full p-3">
					<SidebarTrigger className="scale-130" />
					{children}
				</main>
			</SidebarProvider>
		</div>
	);
}
