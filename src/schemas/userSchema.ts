import { object, string, z } from "zod";

export const loginUserSchema = z.object({
    body: object({
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required",
        }).min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"),
    }),
});

export const createUserSchema = z.object({
    body: object({
        name: string({
            required_error: "Name is required",
        }).min(2, "Name must be at least 2 characters"),
        email: string({
            required_error: "Email is required",
        }).email("Not a valid email"),
        password: string({
            required_error: "Password is required",
        }).min(8, "Password must be at least 8 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"),
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>["body"];