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

export function BarChartSkeleton({ className }: Props) {
	return (
		<div className={cn("h-full w-full", className)}>
			<Card className="h-full">
				<CardHeader>
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent className="flex-1">
					<Skeleton className="aspect-[24/9] w-full max-lg:aspect-video" />
				</CardContent>
				<CardFooter className="flex-col items-start gap-2 text-sm">
					<Skeleton className="h-4 w-full" />
				</CardFooter>
			</Card>
		</div>
	);
}
