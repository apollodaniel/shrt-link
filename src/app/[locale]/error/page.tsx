"use server";
import { Card } from "@/components/ui/card";
import Link from "next/link";

// Error boundaries must be Client Components

export default async function Error() {
	return (
		<div className="flex h-[100vh] w-[100vw] flex-col items-center justify-center">
			<Card className="m-auto max-w-[650px] p-8">
				<h1 className="text-2xl font-bold">
					Oops! Something went wrong.
				</h1>
				<p>
					We&apos;re experiencing a temporary server issue and
					couldn&apos;t process your request.
				</p>
				<p>Please try again in a few moments.</p>
				<p>
					If the problem continues,{" "}
					<Link
						href="/contact"
						className="font-semibold hover:underline"
					>
						contact support
					</Link>{" "}
					.
				</p>
				<Link href="#" className="font-bold hover:underline">
					Retry
				</Link>{" "}
			</Card>
		</div>
	);
}
