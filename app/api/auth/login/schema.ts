import { z } from "zod";

export const schema = z.object({
    email: z.string().email('Invalid email address').min(6, 'Email must be at least 6 characters long'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

export type type = z.infer<typeof schema>;
