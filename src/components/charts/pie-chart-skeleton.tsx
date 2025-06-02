import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
	className?: string;
};

export function PieChartSkeleton({ className }: Props) {
	return (
		<div className={cn("w-full", className)}>
			<Card className="gap-0">
				<CardHeader className="items-center pb-0">
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent className="flex-1 p-4">
					<Skeleton className="mx-auto aspect-square rounded-full" />
				</CardContent>
				<CardFooter className="flex-col gap-3 text-sm">
					<Skeleton className="h-4 w-full" />

					<div className="flex w-full flex-row items-center justify-center gap-2">
						<Skeleton className="aspect-square h-5" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
