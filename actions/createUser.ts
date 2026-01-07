'use server';

import { auth } from '@/lib/auth';
import { signUpSchema, SignUpType } from '@/lib/schemas';

export async function createUserFn(values: SignUpType) {
  try {
    const data = signUpSchema.safeParse(values);

    if (data.error) {
      throw new Error('Invalid data sent.');
    } else if (data.success) {
      const { email, name, password } = data.data;

      const result = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
          callbackURL: '/dashboard',
        },
      });

      if (!result.user) {
        throw new Error('Failed to create user.');
      }

      return {
        success: 'Successfully created your account.',
      };
    }
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
