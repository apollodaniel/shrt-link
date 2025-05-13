"use client";
import { SearchSettings } from "@/lib/types/types";
import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import FilterCombobox from "./filter-combobox";
import { useState } from "react";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

type Props = {
	searchSettings: Partial<SearchSettings>;
	setSearchSettings: (settings: SearchSettings) => void;
};

const orderByList = ["Creation Date", "ID"];
const orderList = ["ASC", "DESC"];

export default function SearchSettingsButton({
	searchSettings,
	setSearchSettings,
}: Props) {
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
				<Label>Order by</Label>
				<FilterCombobox
					currentValue={currentOrderBy}
					label="order by"
					valueList={orderByList}
					setCurrentValue={(value) => setCurrentOrderBy(value)}
				/>
				<Label className="mt-2">Order</Label>
				<FilterCombobox
					currentValue={currentOrder}
					label="order"
					valueList={orderList}
					setCurrentValue={(value) => setCurrentOrder(value)}
				/>
				<div className="mt-2 flex w-full flex-row items-center justify-center gap-2">
					<label htmlFor="showBrowserLabel">
						Show only active URLs
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
					Save changes
				</Button>
			</PopoverContent>
		</Popover>
	);
}
