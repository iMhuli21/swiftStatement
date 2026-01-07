'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { customer } from '@/lib/db/schema';
import { customerSchema, CustomerType } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function createClientFn(values: CustomerType) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user?.id) {
      throw new Error('User not logged in.');
    }

    const parsedSchema = customerSchema.safeParse(values);

    if (parsedSchema.success) {
      const { billingAddress, contactNumber, customerName, email } =
        parsedSchema.data;

      const createClient = await db.insert(customer).values({
        billingAddress,
        contactNumber,
        customerName,
        email,
        sellerId: session.user.id,
      });

      if (!createClient) {
        throw new Error('Something went wrong');
      }

      revalidatePath('/dashboard/clients');

      return {
        success: 'Successfully added client to system.',
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
