"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
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
import { DateChartData } from "@/lib/types/types";

const chartConfig = {
	count: {
		label: "Visitors",
	},
	date: {
		label: "Total visitors",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

type Props = {
	title?: string;
	description?: string;
	className?: string;
	rawChartData?: DateChartData[];
};

export function DateInteractiveLineChart({
	title = "Last month",
	className,
	description = "Showing total visitors for the last month",
	rawChartData = [],
}: Props) {
	const chartData = rawChartData.map((data) => {
		return {
			...data,
			date: data.date.toDateString(),
		};
	});

	const total = {
		count: rawChartData.reduce((acc, curr) => acc + curr.count, 0),
	};

	return (
		<div className={cn("w-full", className)}>
			<Card>
				<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
					<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
					<div className="flex">
						<button className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
							<span className="text-muted-foreground text-xs">
								{chartConfig.date.label}
							</span>
							<span className="text-lg leading-none font-bold sm:text-3xl">
								{total.count.toLocaleString()}
							</span>
						</button>
					</div>
				</CardHeader>
				<CardContent className="px-2 sm:p-6">
					<ChartContainer
						config={chartConfig}
						className="aspect-auto h-[250px] w-full"
					>
						<LineChart
							accessibilityLayer
							data={chartData}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								minTickGap={32}
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									});
								}}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										className="w-[150px]"
										nameKey="count"
										labelFormatter={(value) => {
											return new Date(
												value,
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											});
										}}
									/>
								}
							/>
							<Line
								dataKey={"count"}
								type="monotone"
								stroke={`var(--color-${"date"})`}
								strokeWidth={2}
								dot={false}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
