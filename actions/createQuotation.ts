'use server';

export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { Items } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { quote, quoteItem } from '@/lib/db/schema';
import { QuotationType, quoteSchema } from '@/lib/schemas';

export async function createQuoteFn(
  values: QuotationType,
  customerId: string | undefined,
  quoteItems: Items[],
  total: number
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    const data = quoteSchema.safeParse(values);

    if (data?.error || !customerId || quoteItems.length === 0 || total === 0) {
      throw new Error('Invalid data sent.');
    } else if (data?.success) {
      const { discount, quotePrefix, vat, quoteNumber } = data.data;

      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);

      await db.transaction(async (tx) => {
        const [quo] = await tx
          .insert(quote)
          .values({
            discount: Number(discount),
            vat: vat,
            total,
            validDate: validDate.toISOString().split('T')[0],
            authorId: session.user.id,
            billingId: customerId,
            quotePrefix,
            quoteNumber: Number(quoteNumber),
          })
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

      revalidatePath('/dashboard/quotations');

      return {
        success: 'Successfully created quotation.',
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
