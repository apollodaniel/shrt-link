import AppFooter from "@/components/footer";
import AppNavbar from "@/components/navbar";

export default async function HomeLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	return (
		<div>
			<AppNavbar locale={locale} />
			{children}
			<AppFooter />
		</div>
	);
}
