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
import z from "zod";

export default function Register() {
	const [obscurePass, setObscurePass] = useState(true);

	const formSchema = z
		.object({
			firstName: z
				.string()
				.regex(/^[A-Z][a-z]+$/, {
					message:
						"First name must be capitalized and contain no space",
				})
				.min(2, {
					message: "First name must have at least two letters",
				}),
			lastName: z
				.string()
				.regex(/^[A-Z][a-z]+$/, {
					message:
						"Last name must be capitalized and contain no space",
				})
				.min(2, {
					message: "Last name must have at least two letters",
				}),
			email: z.string().email({
				message: "Invalid email",
			}),
			password: z
				.string()
				.min(8, {
					message: "Password must be at least 8 char long",
				})
				.regex(/[0-9]/, {
					message: "Password must have digits",
				})
				.regex(/[a-z]/, {
					message: "Password must have lowercase letters",
				})
				.regex(/[A-Z]/, {
					message: "Password must have uppercase letters",
				})
				.regex(/[!@#$%^&*()]/, {
					message:
						"Password must contain at least one of the following symbols: !@#$%^&*()",
				}),
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Confirm password must match password",
			path: ["confirmPassword"],
		});

	const form = useForm<z.infer<typeof formSchema>>({
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

	const onSubmit = (formFields: z.infer<typeof formSchema>) => {
		toast(
			<pre className="text-left whitespace-pre-wrap">
				{JSON.stringify(formFields, null, 2)}
			</pre>,
		);
	};

	const watchPass = form.watch("password");

	useEffect(() => {
		form.trigger("confirmPassword");
	}, [watchPass, form]);

	return (
		<div className="flex min-h-screen w-[100vw] flex-col items-center justify-center gap-16 px-2">
			<div className="w-full max-w-[400px]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, (e) =>
							console.log(e),
						)}
						method="POST"
					>
						<Card className="text-start">
							<CardHeader>
								<CardTitle className="text-2xl">
									Register
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<FormField
									name="firstName"
									control={form.control}
									render={({ field }) => (
										<FormItem className="gap-1">
											<FormLabel>First name</FormLabel>
											<FormControl>
												<Input
													placeholder="First name"
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
											<FormLabel>Last name</FormLabel>
											<FormControl>
												<Input
													placeholder="Last name"
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
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="Email"
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
											<FormLabel>Password</FormLabel>
											<FormControl>
												<div className="relative h-auto">
													<Input
														placeholder="Password"
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
												Confirm password
											</FormLabel>
											<FormControl>
												<div className="relative h-auto">
													<Input
														placeholder="Confirm password"
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
									Register
								</Button>
								<Link
									href="/login"
									className="text-sm hover:underline"
								>
									Or sign in to an existing account
								</Link>
							</CardFooter>
						</Card>
					</form>
				</Form>
			</div>
		</div>
	);
}
