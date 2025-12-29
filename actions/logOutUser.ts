'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function signOutUserFn() {
  try {
    const result = await auth.api.signOut({ headers: await headers() });

    if (!result) {
      throw new Error('Something went wrong.');
    }
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
