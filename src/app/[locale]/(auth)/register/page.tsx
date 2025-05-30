"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onSubmit, parseError } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { getRegisterFormSchema, RegisterFormType } from "@/lib/types/schemas";

export default function Register() {
	const [obscurePass, setObscurePass] = useState(true);

	const t = useTranslations("auth_register");
	const formSchema = getRegisterFormSchema(useTranslations());

	const form = useForm<RegisterFormType>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			password: "",
			confirmPassword: "",
		},
	});

	const watchPass = form.watch("password");

	useEffect(() => {
		form.trigger("confirmPassword");
	}, [watchPass, form]);

	return (
		<div className="flex min-h-screen w-[100vw] flex-col items-center justify-center gap-16 px-2">
			<div className="w-full max-w-[400px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(
							(formField) =>
								onSubmit<RegisterFormType>({
									formFields: formField,
									path: "/api/v1/auth/register",
									redirect_location: "dashboard",
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
						<Card className="text-start">
							<CardHeader>
								<CardTitle className="text-2xl">
									{t("title")}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<FormField
									name="firstName"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>
												{t("fields.first_name.label")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t(
														"fields.first_name.label",
													)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="lastName"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>
												{t("fields.last_name.label")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t(
														"fields.last_name.label",
													)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>
												{t("fields.email.label")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t(
														"fields.email.label",
													)}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="password"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>
												{t("fields.password.label")}
											</FormLabel>
											<FormControl>
												<div className="relative h-auto">
													<Input
														placeholder={t(
															"fields.password.label",
														)}
														className="relative"
														type={
															obscurePass
																? "password"
																: "text"
														}
														{...field}
													/>
													<Button
														className="absolute top-0 right-2 bottom-0 my-auto h-7 w-7 p-0"
														variant="ghost"
														type="button"
														onClick={() =>
															setObscurePass(
																(prev) => !prev,
															)
														}
													>
														{obscurePass ? (
															<Eye
																className="text-primary opacity-60"
																size={20}
															/>
														) : (
															<EyeOff
																className="text-primary opacity-60"
																size={20}
															/>
														)}
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="confirmPassword"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>
												{t(
													"fields.confirm_password.label",
												)}
											</FormLabel>
											<FormControl>
												<div className="relative h-auto">
													<Input
														placeholder={t(
															"fields.confirm_password.label",
														)}
														className="relative"
														type={
															obscurePass
																? "password"
																: "text"
														}
														{...field}
													/>
													<Button
														className="absolute top-0 right-2 bottom-0 my-auto h-7 w-7 p-0"
														variant="ghost"
														type="button"
														onClick={() =>
															setObscurePass(
																!obscurePass,
															)
														}
													>
														{obscurePass ? (
															<Eye
																className="text-primary opacity-60"
																size={20}
															/>
														) : (
															<EyeOff
																className="text-primary opacity-60"
																size={20}
															/>
														)}
													</Button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</CardContent>
							<CardFooter className="flex flex-col gap-2">
								<Button type="submit" className="w-full">
									{t("submit_button")}
								</Button>
								<Link
									href="/login"
									className="text-sm hover:underline"
								>
									{t("alternative_button")}
								</Link>
							</CardFooter>
						</Card>
					</form>
				</Form>
			</div>
		</div>
	);
}
