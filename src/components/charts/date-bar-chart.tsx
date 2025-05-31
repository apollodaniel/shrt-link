"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
	title: string;
	description: string;
	footerDescription: string;
	className?: string;
	chartData?: {
		date: string;
		count: number;
	}[];
};

export function DateBarChart({
	className,
	chartData,
	title,
	description,
	footerDescription,
}: Props) {
	const t = useTranslations("charts.defaults");

	const chartConfig = {
		count: {
			label: t("count_label"),
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;
	return (
		<div className={cn("h-full w-full", className)}>
			<Card className="h-full">
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex-1">
					<ChartContainer
						config={chartConfig}
						className="aspect-[24/9] w-full max-lg:aspect-video"
					>
						<BarChart accessibilityLayer data={chartData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 7)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent hideLabel />}
							/>
							<Bar
								dataKey="count"
								fill="var(--color-count)"
								radius={8}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
				<CardFooter className="flex-col items-start gap-2 text-sm">
					<div className="text-muted-foreground leading-none">
						{footerDescription}
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
