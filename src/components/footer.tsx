import { ExternalLink } from "lucide-react";
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

const footerColumns: FooterColumn[] = [
	{
		label: "Product",
		items: [
			{
				label: "Overview",
				href: "#",
			},
			{
				label: "Pricing",
				href: "#",
			},
			{
				label: "Features",
				href: "#",
			},
		],
	},
	{
		label: "Company",
		items: [
			{
				label: "About",
				href: "https://github.com/apollodaniel",
			},
			{
				label: "Team",
				href: "#",
			},
			{
				label: "Blog",
				href: "#",
			},
		],
	},
	{
		label: "Resources",
		items: [
			{
				label: "Help",
				href: "/faq",
			},
			{
				label: "Sales",
				href: "#",
			},
			{
				label: "Advertise",
				href: "#",
			},
			{
				label: "Privacy",
				href: "/privacy",
			},
		],
	},
];

type FooterIcon = {
	svg: string;
	href: string;
	alt: string;
};

export const footerIcons: FooterIcon[] = [
	{
		href: "https://github.com/apollodaniel",
		svg: "/github.svg",
		alt: "github icon with link",
	},
	{
		href: "https://www.linkedin.com/in/apollo-daniel-620570233/",
		svg: "/linkedin.svg",
		alt: "linkedin icon with link",
	},
	{
		href: "mailto:developer.apollo.mail@gmail.com?subject=Vim pelo shrtlink",
		svg: "/gmail.svg",
		alt: "gmail icon with link",
	},
];

export default function AppFooter() {
	return (
		<footer className="mx-8 mb-8 flex flex-col items-center justify-start gap-[24px]">
			<div className="flex w-full flex-wrap items-start justify-between">
				{/* description */}
				<div className="flex min-w-[50vw] flex-col justify-start">
					<Link
						href={"https://apollodaniel.stream"}
						className="mb-2 flex w-56 items-center gap-2 text-xl font-semibold hover:underline"
					>
						apollodaniel.stream
						<ExternalLink />
					</Link>
					<p className="text-primary/60 text-sm">
						Crafting high-performance full-stack websites that drive
						real business results.
					</p>
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
				<p className="me-auto">
					©2025 Apollo Daniel. All rights reserved.
				</p>
				<Link href="#" passHref>
					<p className="hover:text-primary">Terms and Conditions</p>
				</Link>
				<Link href="#" passHref>
					<p className="hover:text-primary">Privacy Policy</p>
				</Link>
			</div>
		</footer>
	);
}
