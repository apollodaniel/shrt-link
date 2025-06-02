"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
import { CountByTimeOfDay } from "@/lib/types/api";
import { useTranslations } from "next-intl";

type Props = {
	description?: string;
	title?: string;
	footerDescription?: string;
	rawChartData?: CountByTimeOfDay[];
};

export function HourRadarChart({
	title = "Hour distribution",
	description = "See the most popular hours among the visitors",
	footerDescription = "Showing hour count for all urls.",
	rawChartData = [],
}: Props) {
	const t = useTranslations("charts.defaults");

	const chartConfig = {
		count: {
			label: t("count_label"),
			color: "var(--chart-1)",
		},
	} satisfies ChartConfig;

	const chartData: CountByTimeOfDay[] = Array.from(
		{ length: 24 },
		(_, i) => i,
	).map((index) => {
		const existingValue = rawChartData.find((i) => Number(i.hour) == index);
		return (
			existingValue || {
				hour: index.toString(),
				count: 0,
			}
		);
	});

	return (
		<Card className="flex flex-col gap-0">
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 p-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square"
				>
					<RadarChart data={chartData}>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent />}
						/>
						<PolarAngleAxis dataKey="hour" />
						<PolarGrid />
						<Radar
							dataKey="count"
							fill="var(--color-count)"
							fillOpacity={0.6}
							dot={{
								r: 4,
								fillOpacity: 1,
							}}
						/>
					</RadarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-3 text-sm">
				<div className="text-muted-foreground leading-none">
					{footerDescription}
				</div>
			</CardFooter>
		</Card>
	);
}
