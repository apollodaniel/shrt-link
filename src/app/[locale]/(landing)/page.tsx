import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Home() {
	const t = await getTranslations("landing_home");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="flex flex-col items-center justify-center gap-3 pt-16 text-center">
				<h1 className="text-4xl font-bold">{t("slogan")}</h1>
				<p>
					{t.rich("description", {
						b: (msg) => <strong>{msg}</strong>,
					})}
				</p>
				<small className="italic">{t("tagline")}</small>
				<Link href="/register" passHref>
					<Button className="mt-4">{t("cta")}</Button>
				</Link>
			</main>
		</div>
	);
}
