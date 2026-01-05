'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { invoice } from '@/lib/db/schema';

export async function deleteInvoiceFn(invoiceId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    if (!invoiceId) {
      throw new Error('No invoice id provided.');
    }

    const deleteInvoice = await db
      .delete(invoice)
      .where(
        and(eq(invoice.id, invoiceId), eq(invoice.authorId, session.user.id))
      );

    if (!deleteInvoice) {
      throw new Error('Something went wrong.');
    }

    return {
      success: 'Successfully deleted invoice.',
    };
  } catch (e) {
    if (e instanceof Error) {
      return {
        error: e.message,
      };
    }
  }
}
