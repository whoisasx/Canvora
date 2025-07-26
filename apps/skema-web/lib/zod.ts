import z from "zod";

export const usernameSchema = z
	.string()
	.min(4, "username must have atleast 4 characters.")
	.max(20, "username must have atmost 20 characters only.")
	.regex(/^(?![.])[a-zA-Z0-9._]+$/, "Invalid username format");

export const passwordSchema = z
	.string()
	.min(8, "password must contain atleast 8 characters.")
	.max(32, "pasword must contain atmost 20 characters only.")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one number")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character"
	);

export const signInSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
});

export const roomNameSchem = z.object({
	name: z.string().min(1, "room name must not be empty."),
});
