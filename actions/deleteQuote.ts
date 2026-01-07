'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { quote } from '@/lib/db/schema';

export async function deleteQuoteFn(quoteId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    if (!quoteId) {
      throw new Error('No quote id provided.');
    }

    const deleteQuote = await db
      .delete(quote)
      .where(and(eq(quote.id, quoteId), eq(quote.authorId, session.user.id)));

    if (!deleteQuote) {
      throw new Error('Something went wrong.');
    }

    return {
      success: 'Successfully deleted quote.',
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
