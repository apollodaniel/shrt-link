import ContactMessage from "@/components/contact-field";
import { footerIcons } from "@/components/footer";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<Card className="w-full max-w-[650px] text-start">
				<CardHeader>
					<div className="text-3xl font-semibold">Contact us</div>
				</CardHeader>
				<ContactMessage
					icons={footerIcons.map((icon) => (
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
				/>
			</Card>
		</div>
	);
}
