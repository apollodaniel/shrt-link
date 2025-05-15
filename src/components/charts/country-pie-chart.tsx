"use client";

import { LabelList, Pie, PieChart } from "recharts";

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
import { CountByCountry } from "@/lib/types/api";
import { capitalizeString, toSnakeCase } from "@/lib/utils/string";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

type ChartDataType = CountByCountry & {
	fill?: string;
};

type Props = {
	description?: string;
	title?: string;
	footerDescription?: string;
	rawChartData?: CountByCountry[];
	forceInnerLabel?: boolean;
	className?: string;
};

const dataKey = "country";

export function CountryPieChart({
	title = "Country distribution",
	description = "See the most popular countriess among the visitors",
	footerDescription = "Showing country count for all urls.",
	forceInnerLabel = false,
	rawChartData = [],
	className,
}: Props) {
	const [showInnerLabel, setShowInnerLabel] = useState(forceInnerLabel);

	const chartConfig: ChartConfig = {};
	rawChartData.forEach((data, index) => {
		const country = data.country.toLowerCase();
		const label = capitalizeString(country);

		chartConfig[toSnakeCase(country)] = {
			label: label,
			color: `var(--chart-${(index % 5) + 1})`,
		};
	});

	const chartData: ChartDataType[] = rawChartData.map((data) => {
		return {
			...data,
			country: toSnakeCase(data.country),
			fill: `var(--color-${toSnakeCase(data.country)})`,
		};
	});

	return (
		<div className={cn("w-full", className)}>
			<Card className="flex flex-col gap-0">
				<CardHeader className="items-center pb-0">
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 p-0">
					<ChartContainer
						config={chartConfig}
						className="[&_.recharts-text]:fill-background mx-auto aspect-square"
					>
						<PieChart>
							<ChartTooltip
								content={
									<ChartTooltipContent
										nameKey="count"
										labelKey={
											!showInnerLabel
												? dataKey
												: undefined
										}
										hideLabel={
											showInnerLabel ? true : false
										}
									/>
								}
							/>
							<Pie data={chartData} dataKey="count">
								{showInnerLabel && (
									<LabelList
										dataKey={dataKey}
										className="fill-background"
										stroke="none"
										fontSize={12}
										formatter={(
											value: keyof typeof chartConfig,
										) => chartConfig[value]?.label}
									/>
								)}
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
				<CardFooter className="flex-col gap-3 text-sm">
					<div className="text-muted-foreground leading-none">
						{footerDescription}
					</div>

					<div className="flex w-full flex-row items-center justify-center gap-2">
						<Checkbox
							id="showCountryLabel"
							checked={showInnerLabel}
							onCheckedChange={(value) =>
								setShowInnerLabel(value ? true : false)
							}
						/>
						<label htmlFor="showCountryLabel">
							Show country label
						</label>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
