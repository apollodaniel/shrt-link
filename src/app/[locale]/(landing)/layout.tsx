import AppFooter from "@/components/footer";
import AppNavbar from "@/components/navbar";

export default function HomeLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<AppNavbar />
			{children}
			<AppFooter />
		</div>
	);
}
