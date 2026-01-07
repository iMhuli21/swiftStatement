'use server';

export const runtime = 'nodejs';

import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { Items } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { invoice, invoiceItem } from '@/lib/db/schema';
import { editInvoiceSchema, EditInvoiceType } from '@/lib/schemas';

export async function updateInvoiceFn(
  values: EditInvoiceType,
  customerId: string | undefined,
  invoiceItems: Items[],
  total: number,
  invoiceId: string
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    const data = editInvoiceSchema.safeParse(values);

    if (
      data?.error ||
      !customerId ||
      invoiceItems.length === 0 ||
      total === 0 ||
      invoiceId.length === 0
    ) {
      throw new Error('Invalid data sent.');
    } else if (data?.success) {
      const { discount, invoicePrefix, vat, status, invoiceNumber, dueDate } =
        data.data;

      const clearInvoiceItems = await db
        .delete(invoiceItem)
        .where(eq(invoiceItem.invoiceId, invoiceId));

      if (!clearInvoiceItems) {
        throw new Error('Something went wrong trying to clear invoice items.');
      }

      await db.transaction(async (tx) => {
        const [inv] = await tx
          .update(invoice)
          .set({
            discount: Number(discount),
            vat: Number(vat),
            total,
            dueDate: dueDate.toISOString().split('T')[0],
            authorId: session.user.id,
            billingId: customerId,
            invoicePrefix,
            invoiceNumber: Number(invoiceNumber),
            status,
          })
          .where(eq(invoice.id, invoiceId))
          .returning({ id: invoice.id });

        await tx.insert(invoiceItem).values(
          invoiceItems.map((item) => ({
            invoiceId: inv.id,
            itemDescription: item.itemDescription,
            qty: item.qty,
            rate: item.rate,
            total: item.total,
          }))
        );
      });

      revalidatePath(`/dashboard/quotations/edit/${invoiceId}`);

      return {
        success: 'Successfully updated invoice.',
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
