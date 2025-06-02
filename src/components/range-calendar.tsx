import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as locales from "date-fns/locale";
import { Locale } from "date-fns";

const localeMap = locales as unknown as Record<string, Locale>;

type Props = {
	locale?: string;
	range?: DateRange;
	setRange: SelectRangeEventHandler;
};

export default function RangeCalendar({
	locale = "en",
	range,
	setRange,
}: Props) {
	const t = useTranslations("dashboard_list.range_calendar");
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"h-12 pl-3 text-left font-normal max-md:ms-auto",
					)}
				>
					<span className="max-[400px]:hidden">
						{range
							? `${range.from?.toLocaleString(locale, { dateStyle: "medium" })}${range.to ? " - " + range.to?.toLocaleString(locale, { dateStyle: "medium" }) : ""}`
							: t("pick_date_range")}
					</span>
					<span className="hidden max-[400px]:inline">
						{range
							? `${range.from?.toLocaleString(locale, { dateStyle: "short" })}${range.to ? " - " + range.to?.toLocaleString(locale, { dateStyle: "short" }) : ""}`
							: t("pick_date_range")}
					</span>
					<CalendarIcon className="text-primary ml-auto h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={range}
					locale={localeMap[locale]}
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
