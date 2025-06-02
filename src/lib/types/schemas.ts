import { getTranslations } from "next-intl/server";
import z from "zod";

export type RegisterFormType = {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	confirmPassword: string;
};

const getField = (error: string) => `auth_register.fields.${error}`;

export const getRegisterFormSchema = (
	t: Awaited<ReturnType<typeof getTranslations>>,
) =>
	z
		.object({
			firstName: z
				.string({
					message: t("auth.required_message"),
				})
				.regex(/^[A-Z][a-z]+$/, {
					message: t(getField("first_name.error_messages.regex")),
				})
				.min(2, {
					message: t(getField("first_name.error_messages.min")),
				}),
			lastName: z
				.string({
					message: t("auth.required_message"),
				})
				.regex(/^[A-Z][a-z]+$/, {
					message: t(getField("last_name.error_messages.regex")),
				})
				.min(2, {
					message: t(getField("last_name.error_messages.min")),
				}),
			email: z
				.string({
					message: t("auth.required_message"),
				})
				.email({
					message: t(getField("email.error_message")),
				}),
			password: z
				.string({
					message: t("auth.required_message"),
				})
				.min(8, {
					message: t(getField("password.error_messages.min")),
				})
				.regex(/[0-9]/, {
					message: t(getField("password.error_messages.digits")),
				})
				.regex(/[a-z]/, {
					message: t(
						getField("password.error_messages.lowercase_char"),
					),
				})
				.regex(/[A-Z]/, {
					message: t(
						getField("password.error_messages.uppercase_char"),
					),
				})
				.regex(/[!@#$%^&*()]/, {
					message: t(getField("password.error_messages.symbols")),
				}),
			confirmPassword: z.string({
				message: t("auth.required_message"),
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t(getField("confirm_password.error_message")),
			path: ["confirmPassword"],
		});
