'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function switchTemplateFn(template: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) throw new Error('User not logged in.');

    const updateTemplate = await db
      .update(user)
      .set({ template })
      .where(eq(user.id, session.user.id));

    if (!updateTemplate) throw new Error('Something went wrong.');

    return {
      success: 'Successfully switched template.',
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
