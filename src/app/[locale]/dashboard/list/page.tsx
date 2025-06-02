"use client";

import { ShortenedUrl } from "@/lib/types/api";
import { Input } from "@/components/ui/input";
import UrlCard from "@/components/url-card";
import { use, useEffect, useState } from "react";
import {
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
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import {
	cn,
	getAppRoute,
	getFullShortenedUrl,
	jsonDateReviver,
} from "@/lib/utils";
import { SearchSettings } from "@/lib/types/types";
import SearchSettingsButton from "@/components/search-settings";
import UrlCardSkeleton from "@/components/url-card-skeleton";
import {
	deleteMultipleUrls,
	filterByDate,
	filterBySettings,
	processSearch,
} from "@/lib/utils/list";
import { toast } from "sonner";
import Link from "next/link";
import RangeCalendar from "@/components/range-calendar";
import { useTranslations } from "next-intl";

const defaultSettings: SearchSettings = {
	isActive: false,
	order: {
		order: "asc",
		by: "creation_date",
	},
};

export default function DashboardList({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = use(params);

	const t = useTranslations("dashboard_list");
	const [urlList, setUrlList] = useState<ShortenedUrl[] | undefined>();

	const [search, setSearch] = useState("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		undefined,
	);
	const [searchSettings, setSearchSettings] = useState<
		SearchSettings | undefined
	>();
	const [isRefreshed, setIsRefreshed] = useState(false);
	const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set([]));
	const [filteredUrls, setFilteredUrls] = useState<ShortenedUrl[]>(
		urlList || [],
	);

	const getUrlList = async () => {
		const oldList = urlList;
		try {
			setUrlList(undefined);
			const response = await fetch(getAppRoute("api/v1/urls/"), {
				credentials: "include",
			});

			const text = await response.text();
			if (response.status == 200) {
				setUrlList(JSON.parse(text, jsonDateReviver));
			} else {
				throw new Error(text);
			}
		} catch (err) {
			if (err instanceof Error) console.log(err.message);
			else console.log(err);
			toast(t("fetch_list_error"));
			if (oldList) setUrlList(oldList);
		}
	};

	useEffect(() => {
		getUrlList().then(() => {
			const settingsItem = window.localStorage.getItem("searchSettings");
			if (settingsItem) {
				try {
					const settings = JSON.parse(settingsItem);
					setSearchSettings(settings);
				} catch (err) {
					console.log(err);
					setSearchSettings(defaultSettings);
				}
			} else {
				setSearchSettings(defaultSettings);
			}
		});
	}, []);

	useEffect(() => {
		if (urlList)
			setFilteredUrls(
				filterBySettings(
					filterByDate(urlList, dateRange),
					searchSettings,
				).filter((url) => processSearch(search, url)),
			);
	}, [search, dateRange, urlList, searchSettings]);

	const refreshButtonAction = () => {
		if (!isRefreshed) {
			getUrlList();
			setIsRefreshed(true);

			if (urlList)
				setFilteredUrls(
					filterBySettings(
						filterByDate(urlList, dateRange),
						searchSettings,
					).filter((url) => processSearch(search, url)),
				);
			setTimeout(() => setIsRefreshed(false), 2000);
		}
	};
	return (
		<div className="w-full space-y-4">
			{urlList && (
				<h2
					className={cn(
						"text-xl font-medium",
						selectedUrls.size == 0 ? "opacity-0" : "",
					)}
				>
					{t("selected_title", {
						size: selectedUrls.size,
						length: urlList.length,
					})}
				</h2>
			)}

			<div className="flex min-h-12 w-full flex-row items-center gap-3 max-md:flex-wrap-reverse max-md:justify-end">
				<div className="relative h-12 w-full">
					<Input
						id="search"
						className="relative h-full ps-10"
						placeholder={t("search_input_label")}
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
											{t("delete_url_error")}:
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
								getUrlList();
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
								locale={locale}
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
					{t("search_selected_message")}
				</small>

				<small
					className={cn(
						"text-muted-foreground ms-auto max-md:ms-0",
						!searchSettings?.isActive ? "hidden" : "",
					)}
				>
					{t("only_active_message")}
				</small>
			</div>

			<div className="flex flex-col gap-2 font-medium">
				{urlList ? (
					filteredUrls.map((url) => (
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
				) : (
					<UrlCardSkeleton />
				)}
			</div>
		</div>
	);
}
