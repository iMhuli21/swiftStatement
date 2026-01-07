'use server';

export const runtime = 'nodejs';
import { auth } from '@/lib/auth';
import { SignInType, signInSchema } from '@/lib/schemas';

export async function loginUserFn(values: SignInType) {
  try {
    const data = signInSchema.safeParse(values);

    if (data.error) {
      return {
        error: 'Invalid data sent.',
      };
    } else if (data.success) {
      const { email, password } = data.data;

      const result = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
      });

      if (!result) {
        throw new Error('Something went wrong.');
      }

      return {
        success: 'Successfully logged in.',
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
