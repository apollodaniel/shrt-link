import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
			<main className="flex w-full flex-col items-center justify-center gap-3 pt-16">
				<Card className="border-primary w-full max-w-64 text-center">
					<CardHeader className="space-y-4">
						<Badge>Most popular</Badge>
						<div className="text-xl font-semibold">Free</div>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-black">Free</div>
						<div>Forever free.</div>
					</CardContent>
					<CardFooter className="mt-3 flex flex-col gap-5">
						<div className="w-full">
							{[
								"Unlimited url shortening",
								"Url Performance Analytics",
							].map((item) => (
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
							<Button className="w-full">Sign up</Button>
						</Link>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
