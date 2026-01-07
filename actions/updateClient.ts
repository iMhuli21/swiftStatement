'use server';

export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { customer } from '@/lib/db/schema';
import { CustomerType, customerSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function updateClientFn(values: CustomerType, clientId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) throw new Error('User not logged in.');

    const data = customerSchema.safeParse(values);

    if (data.error) {
      throw new Error('Invalid data.');
    } else if (data.success) {
      const { billingAddress, contactNumber, customerName, email } = data.data;

      const updateClient = await db
        .update(customer)
        .set({
          billingAddress,
          contactNumber,
          customerName,
          email,
        })
        .where(eq(customer.id, clientId))
        .returning({ id: customer.id });

      if (!updateClient) throw new Error('Something went wrong');

      revalidatePath('/dashboard/clients');

      return {
        success: 'Successfully update client information.',
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
