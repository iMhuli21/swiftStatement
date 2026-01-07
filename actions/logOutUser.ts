'use server';

export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function signOutUserFn() {
  try {
    const result = await auth.api.signOut({ headers: await headers() });

    if (!result) {
      throw new Error('Something went wrong.');
    }

    revalidatePath('/sign-in');
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
