import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

type FooterColumnItem = {
	label: string;
	href: string;
};

type FooterColumn = {
	label: string;
	items: FooterColumnItem[];
};

type FooterIcon = {
	svg: string;
	href: string;
	alt: string;
};

export function getFooterIcons(
	t: Awaited<ReturnType<typeof getTranslations>>,
): FooterIcon[] {
	return [
		{
			href: "https://github.com/apollodaniel",
			svg: "/github.svg",
			alt: t("github_icon_alt"),
		},
		{
			href: "https://www.linkedin.com/in/apollo-daniel-620570233/",
			svg: "/linkedin.svg",
			alt: t("linkedin_icon_alt"),
		},
		{
			href: "mailto:developer.apollo.mail@gmail.com?subject=Vim pelo shrtlink",
			svg: "/gmail.svg",
			alt: t("gmail_icon_alt"),
		},
	];
}
function getFooterColumns(
	t: Awaited<ReturnType<typeof getTranslations>>,
): FooterColumn[] {
	return [
		{
			label: t("product.label"),
			items: [
				{
					label: t("product.items.overview"),
					href: "#",
				},
				{
					label: t("product.items.pricing"),
					href: "#",
				},
				{
					label: t("product.items.features"),
					href: "#",
				},
			],
		},
		{
			label: t("company.label"),
			items: [
				{
					label: t("company.items.about"),
					href: "https://github.com/apollodaniel",
				},
				{
					label: t("company.items.team"),
					href: "#",
				},
				{
					label: t("company.items.blog"),
					href: "#",
				},
			],
		},
		{
			label: t("resources.label"),
			items: [
				{
					label: t("resources.items.help"),
					href: "/faq",
				},
				{
					label: t("resources.items.sales"),
					href: "#",
				},
				{
					label: t("resources.items.advertise"),
					href: "#",
				},
				{
					label: t("resources.items.privacy"),
					href: "#",
				},
			],
		},
	];
}

export default async function AppFooter() {
	const t = await getTranslations("footer");

	const footerColumns: FooterColumn[] = getFooterColumns(t);
	const footerIcons: FooterIcon[] = getFooterIcons(t);

	return (
		<footer className="mx-8 mb-8 flex flex-col items-center justify-start gap-[24px]">
			<div className="flex w-full flex-wrap items-start justify-between gap-5">
				{/* description */}
				<div className="flex min-w-[50vw] flex-col justify-start">
					<Link
						href={"https://apollodaniel.stream"}
						className="mb-2 flex w-56 items-center gap-2 text-xl font-semibold hover:underline"
					>
						apollodaniel.stream
						<ExternalLink />
					</Link>
					<p className="text-primary/60 text-sm">{t("slogan")}</p>
					<div className="mt-4 flex flex-wrap items-center gap-6">
						{footerIcons.map((icon) => (
							<Link key={icon.svg} href={icon.href}>
								<Image
									height={24}
									width={24}
									className="opacity-60 hover:opacity-100 dark:invert"
									src={icon.svg}
									alt={icon.alt}
								/>
							</Link>
						))}
					</div>
				</div>
				{/* columns */}
				{footerColumns.map((column) => (
					<div className="flex flex-col gap-3" key={column.label}>
						<h3 className="text-md mb-2 font-bold">
							{column.label}
						</h3>
						{column.items.map((columnItem) => (
							<Link
								key={columnItem.label}
								href={columnItem.href}
								className="text-primary/60 hover:text-primary text-sm font-medium"
							>
								{columnItem.label}
							</Link>
						))}
					</div>
				))}
			</div>
			<div className="bg-primary/10 mx-4 h-[1px] w-full"></div>
			<div className="text-primary/60 flex w-full flex-wrap gap-5 text-sm font-medium">
				<p className="me-auto">{t("copyright")}</p>
				<Link href="#" passHref>
					<p className="hover:text-primary">{t("terms")}</p>
				</Link>
				<Link href="#" passHref>
					<p className="hover:text-primary">{t("privacy")}</p>
				</Link>
			</div>
		</footer>
	);
}
