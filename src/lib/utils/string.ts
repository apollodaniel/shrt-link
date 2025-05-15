import { DateChartData } from "../types/types";

export function capitalizeString(value: string): string {
	const lowCaseCharReg = /\b[a-z]/g;
	return value
		.toLowerCase()
		.replace(lowCaseCharReg, (char) => char.toUpperCase());
}
export function toSnakeCase(value: string): string {
	return value.toLowerCase().replace(" ", "_");
}

export function filterDateListRange(
	dateList: DateChartData[],
	monthPeriod: number,
): DateChartData[] {
	const list = dateList.map((date) => {
		return {
			...date,
			date: new Date(date.date),
		};
	});

	const now = new Date();
	const someMonthsAgo = new Date();
	someMonthsAgo.setMonth(now.getMonth() - monthPeriod);
	return list.filter((date) => date.date > someMonthsAgo);
}

export function dateListToYearList(
	dateList: DateChartData[],
): { date: string; count: number }[] {
	const list = dateList.map((date) => {
		return {
			...date,
			date: date.date.getFullYear(),
		};
	});

	const sum: Map<number, number> = new Map();
	for (const { date, count } of list) {
		if (sum.has(date)) sum.set(date, sum.get(date)! + count);
		else sum.set(date, count);
	}

	return Array.from(sum.entries()).map(([year, count]) => ({
		date: year.toString(),
		count,
	}));
}

export function dateListToMonthList(
	dateList: DateChartData[],
): { date: string; count: number }[] {
	const list = dateList.map((date) => {
		return {
			...date,
			date: date.date.toLocaleString("default", { month: "short" }),
		};
	});

	const sum: Map<string, number> = new Map();
	for (const { date, count } of list) {
		if (sum.has(date)) sum.set(date, sum.get(date)! + count);
		else sum.set(date, count);
	}

	return Array.from(sum.entries()).map(([year, count]) => ({
		date: year.toString(),
		count,
	}));
}
