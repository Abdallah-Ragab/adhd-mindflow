import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address').min(6, 'Email must be at least 6 characters long'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long')
});