'use server';

export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db/drizzle';
import { Items } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { invoice, invoiceItem } from '@/lib/db/schema';
import { invoiceSchema, InvoiceType } from '@/lib/schemas';

export async function createInvoiceFn(
  values: InvoiceType,
  customerId: string,
  invoiceItems: Items[],
  total: number
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) throw new Error('User not logged in.');

    const data = invoiceSchema.safeParse(values);

    if (data.error || !customerId) {
      throw new Error('Invalid data sent.');
    } else if (data.success) {
      const { discount, dueDate, invoicePrefix, vat, invoiceNumber } =
        data.data;

      await db.transaction(async (tx) => {
        const [inv] = await tx
          .insert(invoice)
          .values({
            discount: Number(discount),
            vat: Number(vat),
            total,
            dueDate: dueDate.toISOString().split('T')[0],
            authorId: session.user.id,
            billingId: customerId,
            invoicePrefix,
            invoiceNumber: Number(invoiceNumber),
          })
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

      revalidatePath('/dashboard/invoices');

      return {
        success: 'Successfully created a new invoice.',
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
