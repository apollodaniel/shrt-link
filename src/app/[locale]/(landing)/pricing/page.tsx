import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Pricing() {
	const t = await getTranslations("landing_pricing");

	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="flex w-full flex-col items-center justify-center gap-3 pt-16">
				<Card className="border-primary w-full max-w-64 text-center">
					<CardHeader className="space-y-4">
						<Badge>{t("main_card.badge")}</Badge>
						<div className="text-xl font-semibold">
							{t("main_card.price")}
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-black">
							{t("main_card.title")}
						</div>
						<div>{t("main_card.subtitle")}</div>
					</CardContent>
					<CardFooter className="mt-3 flex flex-col gap-5">
						<div className="w-full">
							{(
								(t.raw("main_card.features") || []) as string[]
							).map((item) => (
								<div
									key={item}
									className="flex w-full items-center justify-start gap-2 text-start text-sm"
								>
									<Check size={20} />
									<span>{item}</span>
								</div>
							))}
						</div>
						<Link href="/register" passHref className="w-full">
							<Button className="w-full">
								{t("main_card.cta")}
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
