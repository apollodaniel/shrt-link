"use client";

import { ShortenedUrl } from "@/lib/types/api";
import { Input } from "./ui/input";
import UrlCard from "./url-card";
import { useEffect, useState } from "react";
import {
	CalendarIcon,
	Check,
	RefreshCcw,
	Search,
	Trash2,
	X,
	SquareCheck,
	Square,
	MinusSquare,
	Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn, getAppRoute, getFullShortenedUrl } from "@/lib/utils";
import { SearchSettings } from "@/lib/types/types";
import SearchSettingsButton from "./search-settings";
import UrlCardSkeleton from "./url-card-skeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { revalidateSummary } from "@/app/actions/dashboard/dashboard";

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
}: {
	range?: DateRange;
	setRange: SelectRangeEventHandler;
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"h-12 w-[240px] pl-3 text-left font-normal max-md:ms-auto",
					)}
				>
					<span>
						{range
							? `${range.from?.toLocaleString("default", { dateStyle: "medium" })}${range.to ? " - " + range.to?.toLocaleString("default", { dateStyle: "medium" }) : ""}`
							: "Pick a date range"}
					</span>
					<CalendarIcon className="text-primary ml-auto h-4 w-4" />
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
	const getDays = (date: Date) =>
		Math.round(date.getTime() / 1000 / 60 / 60 / 24);
	if (!rangeDate) return urlList;
	return urlList.filter((url) => {
		const creationDays = getDays(url.creationDate);
		const fromDays = rangeDate.from ? getDays(rangeDate.from) : 0;
		const toDays = rangeDate.to
			? getDays(rangeDate.to)
			: getDays(new Date(Date.now()));
		const isBefore = creationDays <= toDays;
		const isAfter = creationDays >= fromDays;
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
					? url.statistics.find(
							(s) =>
								Date.now() - s.accessTime.getTime() <
								24 * 60 * 60 * 1000,
						)
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

async function deleteMultipleUrls(
	urlList: string[],
): Promise<{ urlId: string; error: string }[]> {
	const detailedRelatory: { urlId: string; error: string }[] = [];
	for (const url of urlList) {
		try {
			const response = await fetch(getAppRoute(`api/v1/urls/${url}`), {
				method: "DELETE",
				credentials: "include",
			});

			if (response.status != 200)
				throw new Error(
					`Unable to delete url: ${JSON.stringify(
						{
							status: response.status,
							body: response.body,
						},
						null,
						2,
					)}`,
				);
		} catch (err) {
			console.log(err.message);
			detailedRelatory.push({
				urlId: url,
				error: err.message || "Unknown error",
			});
		}
	}

	revalidateSummary();
	return detailedRelatory;
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
	const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set([]));
	const [filteredUrls, setFilteredUrls] = useState(urlList);

	useEffect(() => {
		const settingsItem = window.localStorage.getItem("searchSettings");
		if (settingsItem) {
			setSearchSettings(JSON.parse(settingsItem) || defaultSettings);
		}
	}, []);

	useEffect(() => {
		setFilteredUrls(
			filterBySettings(
				searchSettings,
				filterByDate(dateRange, urlList),
			).filter((url) => processSearch(search, url)),
		);
	}, [search, dateRange, urlList, searchSettings]);

	const refreshButtonAction = () => {
		if (!isRefreshed) {
			router.refresh();
			setIsRefreshed(true);

			setFilteredUrls(
				filterBySettings(
					searchSettings,
					filterByDate(dateRange, urlList),
				).filter((url) => processSearch(search, url)),
			);
			setTimeout(() => setIsRefreshed(false), 2000);
		}
	};
	return (
		<div className="w-full space-y-4">
			<h2
				className={cn(
					"text-xl font-medium",
					selectedUrls.size == 0 ? "opacity-0" : "",
				)}
			>
				{`Selected ${selectedUrls.size} of ${urlList.length}`}
			</h2>

			<div className="flex min-h-12 w-full flex-row items-center gap-3 max-md:flex-wrap-reverse max-md:justify-end">
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

				{selectedUrls.size > 0 ? (
					<>
						<Button
							className="aspect-square h-full"
							variant="outline"
							onClick={async () => {
								const result = await deleteMultipleUrls(
									Array.from(selectedUrls),
								);
								if (result.length > 0) {
									const urlList = result.map((r) => r.urlId);
									toast.error(
										<>
											Unable to delete the following URLs:
											<br />
											<ul>
												{urlList.map((u) => (
													<li key={u}>
														-{" "}
														{getFullShortenedUrl(u)}
													</li>
												))}
											</ul>
										</>,
										{
											richColors: true,
											position: "bottom-center",
											classNames: {
												toast: "justify-between",
											},
											action: (
												<Link
													href={`mailto:developer.apollo.mail@gmail.com?subject=ShrtLink error&body=Got error while trying to delete URLs: ${JSON.stringify(result, null, 2)}`}
													passHref
												>
													<Button variant={"ghost"}>
														<Send className="scale-130" />
													</Button>
												</Link>
											),
										},
									);
								}
								router.refresh();
								setSelectedUrls(new Set([]));
							}}
						>
							<Trash2 className="scale-120" />
						</Button>

						<Button
							className="aspect-square h-full"
							variant="outline"
							onClick={() => {
								if (selectedUrls.size >= filteredUrls.length) {
									setSelectedUrls(new Set([]));
								} else {
									setSelectedUrls(
										new Set(
											filteredUrls.map((url) => url.id),
										),
									);
								}
							}}
						>
							{selectedUrls.size >= filteredUrls.length ? (
								<SquareCheck className="scale-120" />
							) : selectedUrls.size > 0 ? (
								<MinusSquare className="scale-120" />
							) : (
								<Square className="scale-120" />
							)}
						</Button>
					</>
				) : (
					<div className="flex flex-row items-center justify-end gap-1 max-md:flex-wrap-reverse">
						{searchSettings && (
							<RangeCalendar
								range={dateRange}
								setRange={setDateRange}
							/>
						)}
						<div className="flex flex-row items-center gap-1">
							<Button
								variant={isRefreshed ? "default" : "outline"}
								className="aspect-square h-full"
								onClick={refreshButtonAction}
							>
								{isRefreshed ? <Check /> : <RefreshCcw />}
							</Button>
							{searchSettings && (
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
							)}

							<Button
								className="aspect-square h-full"
								variant="outline"
								onClick={() => {
									if (
										selectedUrls.size >= filteredUrls.length
									) {
										setSelectedUrls(new Set([]));
									} else {
										setSelectedUrls(
											new Set(
												filteredUrls.map(
													(url) => url.id,
												),
											),
										);
									}
								}}
							>
								{selectedUrls.size >= filteredUrls.length ? (
									<SquareCheck className="scale-120" />
								) : selectedUrls.size > 0 ? (
									<MinusSquare className="scale-120" />
								) : (
									<Square className="scale-120" />
								)}
							</Button>
						</div>
					</div>
				)}
			</div>
			<div className="flex w-full flex-row items-center justify-between max-md:flex-col">
				<small
					className={cn(
						"text-muted-foreground",
						search.length == 0 ? "hidden" : "",
					)}
				>
					When searching the &quot;select all&quot; button is limited
					to the search scope.
				</small>

				<small
					className={cn(
						"text-muted-foreground ms-auto max-md:ms-0",
						!searchSettings?.isActive ? "hidden" : "",
					)}
				>
					Displaying only active
				</small>
			</div>

			<div className="flex flex-col gap-2 font-medium">
				{searchSettings
					? filteredUrls.map((url) => (
							<UrlCard
								key={url.id}
								url={url}
								isSelected={selectedUrls.has(url.id)}
								setIsSelected={(id, value) => {
									if (value) {
										setSelectedUrls((prev) =>
											new Set(prev).add(id),
										);
									} else {
										setSelectedUrls((prev) => {
											const newSet = new Set(prev);
											newSet.delete(id);
											return newSet;
										});
									}
								}}
							/>
						))
					: urlList.map((url) => <UrlCardSkeleton key={url.id} />)}
			</div>
		</div>
	);
}
