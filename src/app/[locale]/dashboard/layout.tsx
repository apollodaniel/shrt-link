import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default async function DashboardLayout({
	children,
	params,
}: {
	children: ReactNode[];
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
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
				<DashboardSidebar locale={locale} />

				<div className="w-full">
					<div className="bg-background/50 fixed top-0 z-50 -mb-4 w-full p-3 backdrop-blur-lg">
						<SidebarTrigger className="scale-130" />
					</div>

					<main className="max-h-[100vh] w-full p-3 pt-20">
						{children}
					</main>
				</div>
			</SidebarProvider>
		</div>
	);
}
