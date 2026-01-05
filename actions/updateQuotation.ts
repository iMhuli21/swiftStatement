'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { Items } from '@/lib/constants';
import { editQuoteSchema, EditQuoteType } from '@/lib/schemas';
import { quote, quoteItem } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateQuoteFn(
  values: EditQuoteType,
  customerId: string | undefined,
  quoteItems: Items[],
  total: number,
  quoteId: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    const data = editQuoteSchema.safeParse(values);

    if (
      data?.error ||
      !customerId ||
      quoteItems.length === 0 ||
      total === 0 ||
      quoteId.length === 0
    ) {
      throw new Error('Invalid data sent.');
    } else if (data?.success) {
      const { discount, quotePrefix, vat, status, quoteNumber } = data.data;

      const clearQuoteItems = await db
        .delete(quoteItem)
        .where(eq(quoteItem.quoteId, quoteId));

      if (!clearQuoteItems) {
        throw new Error('Something went wrong trying to clear quote items.');
      }

      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);

      await db.transaction(async (tx) => {
        const [quo] = await tx
          .update(quote)
          .set({
            discount: Number(discount),
            vat: vat,
            total,
            validDate: validDate.toISOString().split('T')[0],
            authorId: session.user.id,
            billingId: customerId,
            quotePrefix,
            quoteNumber: Number(quoteNumber),
            status,
          })
          .where(eq(quote.id, quoteId))
          .returning({ id: quote.id });

        await tx.insert(quoteItem).values(
          quoteItems.map((item) => ({
            quoteId: quo.id,
            itemDescription: item.itemDescription,
            qty: item.qty,
            rate: item.rate,
            total: item.total,
          }))
        );
      });

      revalidatePath(`/dashboard/quotations/edit/${quoteId}`);

      return {
        success: 'Successfully updated quote.',
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
