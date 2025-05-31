"use client";
import { SearchSettings } from "@/lib/types/types";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import FilterCombobox from "./filter-combobox";
import { useState } from "react";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useTranslations } from "next-intl";

type Props = {
	searchSettings: Partial<SearchSettings>;
	setSearchSettings: (settings: SearchSettings) => void;
};

export default function SearchSettingsButton({
	searchSettings,
	setSearchSettings,
}: Props) {
	const t = useTranslations("dashboard_list.settings");

	const orderByList = ["creation_date", "id"];
	const orderList = ["asc", "desc"];

	const [currentOrderBy, setCurrentOrderBy] = useState(
		searchSettings.order?.by || orderByList[0],
	);
	const [currentOrder, setCurrentOrder] = useState(
		searchSettings.order?.order || orderList[0],
	);
	const [isActive, setIsActive] = useState(searchSettings.isActive || false);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popover
			open={isOpen}
			onOpenChange={(open) => {
				if (open == false) {
					setCurrentOrderBy(
						searchSettings.order?.by || orderByList[0],
					);
					setCurrentOrder(
						searchSettings.order?.order || orderList[0],
					);
					setIsActive(searchSettings.isActive || false);
				}
				setIsOpen(open);
			}}
		>
			<PopoverTrigger asChild>
				<Button variant="outline" className="aspect-square h-full">
					<SlidersHorizontal />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] space-y-1">
				<Label>{t("order_by_label")}</Label>
				<FilterCombobox
					currentValue={currentOrderBy}
					label="order by"
					valueList={orderByList}
					setCurrentValue={(value) => setCurrentOrderBy(value)}
					parseValue={(key) => t(`order_by.${key}`)}
				/>
				<Label className="mt-2">{t("order_direction_label")}</Label>
				<FilterCombobox
					currentValue={currentOrder}
					label="order"
					valueList={orderList}
					setCurrentValue={(value) => setCurrentOrder(value)}
					parseValue={(key) => t(`order_direction.${key}`)}
				/>
				<div className="mt-2 flex w-full flex-row items-center justify-center gap-2">
					<label htmlFor="showBrowserLabel">
						{t("active_url_label")}
					</label>
					<Checkbox
						checked={isActive}
						onCheckedChange={(value) => {
							setIsActive(value ? true : false);
						}}
					/>
				</div>
				<Button
					className="mt-3 w-full"
					onClick={() => {
						setSearchSettings({
							order: {
								by: currentOrderBy,
								order: currentOrder,
							},
							isActive: isActive,
						});
						setIsOpen(false);
					}}
				>
					{t("submit")}
				</Button>
			</PopoverContent>
		</Popover>
	);
}
