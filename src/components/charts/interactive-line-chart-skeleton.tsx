import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
	className?: string;
};

export function InteractiveLineChartSkeleton({ className }: Props) {
	return (
		<div className={cn("w-full", className)}>
			<Card>
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-full" />
					</div>
					<Skeleton className="me-2 aspect-square px-6 py-4 sm:px-8 sm:py-6" />
				</CardHeader>
				<CardContent className="px-2 sm:p-6">
					<Skeleton className="aspect-auto h-[250px] w-full" />
				</CardContent>
			</Card>
		</div>
	);
}
