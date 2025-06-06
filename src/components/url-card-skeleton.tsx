import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function UrlCardSkeleton({
	isMinimal = false,
}: {
	isMinimal?: boolean;
}) {
	return (
		<div className="flex h-[100px] items-start justify-between rounded-2xl border-1 border-[--color-border] p-4">
			<div className="flex h-full flex-col gap-2">
				<Skeleton className="h-2 w-[150px]" />
				<Skeleton className="h-2 w-[200px]" />
				<Skeleton className="mt-auto mb-1 h-2 w-[150px]" />
			</div>

			<Skeleton
				className={cn(
					"aspect-square h-9",
					!isMinimal ? "hidden max-sm:block" : "",
				)}
			/>
			<div
				className={cn(
					"flex flex-row items-start gap-3",
					isMinimal ? "hidden" : "max-sm:hidden",
				)}
			>
				<Skeleton className="aspect-square h-9" />
				<Skeleton className="aspect-square h-9" />
				<Skeleton className="aspect-[2.5/1] h-9" />
			</div>
		</div>
	);
}
