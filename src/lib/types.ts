import z from "zod";

export enum SessionStatus {
	AUTHENTICATED = "authenticated",
	NO_SESSION = "no_session",
}

export type ErrorEntry = {
	code: string;
	field?: string; // for the case of using it as an field error
	message: string;
	statusCode: number;
};

export type FieldError = {
	type: string;
	value: string;
	msg: string;
	path: string;
	location: string;
};

export type FormattedFieldError = {
	path: string;
	messages: string[];
};

export const REGISTER_FORM_SCHEMA = z
	.object({
		firstName: z
			.string()
			.regex(/^[A-Z][a-z]+$/, {
				message: "First name must be capitalized and contain no space",
			})
			.min(2, {
				message: "First name must have at least two letters",
			}),
		lastName: z
			.string()
			.regex(/^[A-Z][a-z]+$/, {
				message: "Last name must be capitalized and contain no space",
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
