import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

export function RadarChartSkeleton() {
	return (
		<Card className="flex flex-col gap-0">
			<CardHeader className="items-center pb-0">
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-4 w-full" />
			</CardHeader>
			<CardContent className="flex-1 p-4">
				<Skeleton className="mx-auto aspect-square rounded-full" />
			</CardContent>
			<CardFooter className="flex-col gap-3 text-sm">
				<Skeleton className="h-4 w-full" />
			</CardFooter>
		</Card>
	);
}
