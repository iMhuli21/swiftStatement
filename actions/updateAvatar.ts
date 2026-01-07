'use server';

export const runtime = 'nodejs';

import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { headers } from 'next/headers';

export async function updateAvatarFn(imageUrl: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) throw new Error('User not logged in.');

    const query = await db
      .update(user)
      .set({ image: imageUrl })
      .where(eq(user.id, session.user.id));

    if (!query) throw new Error('Something went wrong.');

    return {
      success: 'Successfully changed avatar.',
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
