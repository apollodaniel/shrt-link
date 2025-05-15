import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="flex flex-col items-center justify-center gap-3 pt-16 text-center">
				<h1 className="text-4xl font-bold">
					Shorten, Share, Simplify.
				</h1>
				<p>
					Transform long, clunky URLs into <strong>compact</strong>,{" "}
					<strong>shareable links in seconds</strong>.
				</p>
				<small className="italic">Free, Fast, and Reliable.</small>
				<Link href="/register" passHref>
					<Button className="mt-4">Get started for free</Button>
				</Link>
			</main>
		</div>
	);
}
