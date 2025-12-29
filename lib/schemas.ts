import * as z from 'zod';

export const signUpSchema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(2, 'Name is required.'),
  password: z.string().min(8, 'Password must atleast be 8 characters long.'),
});

export type SignUpType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email('Invalid email.'),
  password: z.string('Password is required.'),
});

export type SignInType = z.infer<typeof signInSchema>;
