"use client";

import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
	DialogFooter,
	Dialog,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogDescription,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	getAppRoute,
	jsonDateReviver,
	onSubmit,
	parseError,
} from "@/lib/utils";
import { toast } from "sonner";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
} from "./ui/form";
import { useState } from "react";
import { useSidebar } from "./ui/sidebar";
import { useTranslations } from "next-intl";

export default function AddUrlDialog({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = useTranslations("dashboard_sidebar.add_url.popup");
	const authT = useTranslations("auth");
	const formSchema = z.object({
		originalUrl: z
			.string({ message: authT("required_message") })
			.nonempty({ message: authT("required_message") })
			.regex(
				/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
				{
					message: t("invalid_url_message"),
				},
			),
	});

	const [isOpen, setIsOpen] = useState(false);
	const sidebar = useSidebar();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
		defaultValues: {
			originalUrl: "",
		},
	});

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
			}}
		>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("title")}</DialogTitle>
					<DialogDescription>{t("description")}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(
							(formField) =>
								onSubmit<z.infer<typeof formSchema>>({
									formFields: formField,
									path: "/api/v1/urls/",
									redirect_location: (body) => {
										const json = JSON.parse(
											body,
											jsonDateReviver,
										);
										if (json.id) {
											setIsOpen(false);
											if (sidebar.isMobile)
												sidebar.setOpenMobile(false);
											else sidebar.setOpen(false);
											form.reset({
												originalUrl: "",
											});

											return getAppRoute(
												`dashboard/${json.id}`,
											);
										}
									},
									onError: async (response: Response) => {
										parseError<
											Parameters<typeof form.setError>[0]
										>(
											await response.text(),
											(field, message) =>
												form.setError(field, message),
											(message, opts) =>
												toast.error(message, opts),
										);
									},
								}),
							(err) => console.log("Err: " + err),
						)}
						method="POST"
					>
						<FormField
							control={form.control}
							name="originalUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("input_label")}</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.etc"
											type={"url"}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="mt-4">
							<Button type="submit">{t("submit")}</Button>
							<DialogTrigger asChild>
								<Button
									onClick={() => {
										form.reset({ originalUrl: "" });
										form.clearErrors();
									}}
								>
									{t("cancel")}
								</Button>
							</DialogTrigger>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
