"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
	currentValue?: string;
	setCurrentValue: (value: string) => void;
	parseValue: (key: string) => string;
	valueList: string[];
	label: string;
};

export default function FilterCombobox({
	label,
	currentValue,
	setCurrentValue,
	valueList,
	parseValue,
}: Props) {
	const [open, setOpen] = useState(false);
	const t = useTranslations("misc");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{currentValue
						? parseValue(currentValue)
						: t("combobox_select_label")}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[275px] p-0">
				<Command>
					<CommandInput
						placeholder={t("combobox_search_label")}
						className="h-9"
					/>
					<CommandList>
						<CommandEmpty>No {label} found.</CommandEmpty>
						<CommandGroup>
							{valueList.map((value) => (
								<CommandItem
									key={value}
									value={value}
									onSelect={(e) => {
										setCurrentValue(e);
										setOpen(false);
									}}
								>
									{parseValue(value)}
									<Checkbox
										className={cn(
											"ml-auto",
											value === currentValue
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
