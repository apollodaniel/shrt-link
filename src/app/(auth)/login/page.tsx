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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Login() {
	const [obscurePass, setObscurePass] = useState(true);

	const formSchema = z.object({
		email: z.string().email({
			message: "Invalid email format",
		}),
		password: z.string().min(1, {
			message: "Password is required",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		mode: "onChange",
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = (formFields: z.infer<typeof formSchema>) => {
		toast(
			<pre className="text-left whitespace-pre-wrap">
				{JSON.stringify(formFields, null, 2)}
			</pre>,
		);
	};

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
									Login
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
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
							</CardContent>
							<CardFooter className="flex flex-col gap-2">
								<Button type="submit" className="w-full">
									Login
								</Button>
								<Link
									href="/register"
									className="text-sm hover:underline"
								>
									Or register a new account
								</Link>
							</CardFooter>
						</Card>
					</form>
				</Form>
			</div>
		</div>
	);
}
