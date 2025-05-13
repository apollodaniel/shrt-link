"use client";

import { ShortenedUrl } from "@/lib/types/api";
import { Input } from "./ui/input";
import UrlCard from "./url-card";
import { useEffect, useState } from "react";
import { CalendarIcon, Check, RefreshCcw, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { SearchSettings } from "@/lib/types/types";
import SearchSettingsButton from "./search-settings";
import UrlCardSkeleton from "./url-card-skeleton";
import { useRouter } from "next/navigation";

type Props = {
	urlList: ShortenedUrl[];
};

const defaultSettings: SearchSettings = {
	isActive: false,
	order: {
		order: "ASC",
		by: "Creation Date",
	},
};

function processSearch(search: string, url: ShortenedUrl) {
	return (
		url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
		url.metadata?.title?.toLowerCase().includes(search.toLowerCase())
	);
}

function RangeCalendar({
	range,
	setRange,
	isActive,
}: {
	range?: DateRange;
	setRange: SelectRangeEventHandler;
	isActive: boolean;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"h-12 w-[240px] pl-3 text-left font-normal",
						"text-muted-foreground",
					)}
				>
					<span>
						{range
							? `${range.from?.toLocaleString("default", { dateStyle: "medium" })}${range.to ? " - " + range.to?.toLocaleString("default", { dateStyle: "medium" }) : ""}${isActive ? " (only active)" : ""}`
							: "Pick a date range"}
					</span>
					<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={range}
					onSelect={setRange}
					disabled={(date) =>
						date > new Date() || date < new Date("1900-01-01")
					}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

function filterByDate(
	rangeDate?: DateRange,
	urlList: ShortenedUrl[],
): ShortenedUrl[] {
	if (!rangeDate) return urlList;
	return urlList.filter((url) => {
		const isBefore =
			url.creationDate.getTime() <
			(rangeDate.to?.getTime() || Date.now());
		const isAfter =
			url.creationDate.getTime() > (rangeDate.from?.getTime() || 0);
		return isBefore && isAfter;
	});
}

function filterBySettings(
	settings?: SearchSettings,
	urlList: ShortenedUrl[],
): ShortenedUrl[] {
	if (!settings) return urlList;

	return (
		urlList
			// filter if is active
			.filter((url) =>
				settings.isActive
					? Date.now() - url.creationDate.getTime() <
						24 * 60 * 60 * 1000
					: true,
			)
			// short by order settings
			.sort((a, b) => {
				if (settings.order?.by == "Creation Date") {
					// url.creationDate.get
					const bTime = b.creationDate.getTime();
					const aTime = a.creationDate.getTime();

					return settings.order.order == "DESC"
						? bTime - aTime
						: aTime - bTime;
				} else {
					return settings.order?.order == "DESC"
						? b.id.localeCompare(a.id)
						: a.id.localeCompare(b.id);
				}
			})
	);
}

export default function UrlList({ urlList }: Props) {
	const [search, setSearch] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: new Date("2020-05-05"),
		to: new Date(Date.now()),
	});
	const [searchSettings, setSearchSettings] = useState<
		SearchSettings | undefined
	>();
	const [isRefreshed, setIsRefreshed] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const settingsItem = window.localStorage.getItem("searchSettings");
		if (settingsItem) {
			setSearchSettings(JSON.parse(settingsItem) || defaultSettings);
		}
	}, []);

	return (
		<div className="w-full space-y-4">
			<div className="flex h-12 w-full flex-row items-stretch gap-3">
				<div className="relative h-12 w-full">
					<Input
						id="search"
						className="relative h-full ps-10"
						placeholder="Search"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
					{search.length == 0 ? (
						<Search
							className="text-muted-foreground absolute top-0 bottom-0 left-3 my-auto"
							size={20}
						/>
					) : (
						<Button
							size="sm"
							className="absolute top-0 bottom-0 left-1 my-auto p-0"
							variant="ghost"
							onClick={() => setSearch("")}
						>
							<X className="text-muted-foreground m-0 scale-130" />
						</Button>
					)}
				</div>

				<Button
					variant={isRefreshed ? "default" : "outline"}
					className="aspect-square h-full"
					onClick={() => {
						if (!isRefreshed) {
							router.refresh();
							setIsRefreshed(true);
							setTimeout(() => setIsRefreshed(false), 2000);
						}
					}}
				>
					{isRefreshed ? <Check /> : <RefreshCcw />}
				</Button>
				{searchSettings && (
					<>
						<SearchSettingsButton
							searchSettings={searchSettings}
							setSearchSettings={(settings) => {
								setSearchSettings(settings);
								window.localStorage.setItem(
									"searchSettings",
									JSON.stringify(settings),
								);
							}}
						/>
						<RangeCalendar
							range={
								searchSettings.isActive
									? { from: new Date(Date.now()) }
									: dateRange
							}
							setRange={
								searchSettings.isActive
									? () => {}
									: setDateRange
							}
							isActive={searchSettings.isActive || false}
						/>
					</>
				)}
			</div>
			<div className="flex flex-col gap-2 font-medium">
				{searchSettings
					? filterBySettings(
							searchSettings,
							filterByDate(dateRange, urlList),
						)
							.filter((url) => processSearch(search, url))
							.map((url) => <UrlCard key={url.id} url={url} />)
					: urlList.map((url) => <UrlCardSkeleton key={url.id} />)}
			</div>
		</div>
	);
}
