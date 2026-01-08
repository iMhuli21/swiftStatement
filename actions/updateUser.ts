'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { user } from '@/lib/db/schema';
import { editUserInfoSchema, EditUserInfoType } from '@/lib/schemas';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function updateUserFn(
  values: EditUserInfoType,
  logoUrl: string | null
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user.id) throw new Error('User not logged in.');

    const data = editUserInfoSchema.safeParse(values);

    if (data.error) {
      throw new Error('Invalid data sent.');
    } else if (data.success) {
      const {
        companyAccNo,
        companyAccType,
        companyBank,
        companyBranchCode,
        companyName,
        contactNumber,
        emailAddress,
        name,
      } = data.data;

      if (logoUrl) {
        const query = await db
          .update(user)
          .set({
            companyAccountNumber: Number(companyAccNo),
            companyAccountType: companyAccType,
            companyBank,
            companyBranchCode: Number(companyBranchCode),
            companyName,
            contactNumber,
            email: emailAddress,
            name,
            logoUrl,
          })
          .where(eq(user.id, session.user.id));

        if (!query) throw new Error('Something went wrong.');

        revalidatePath('/dashboard/settings');

        return {
          success: 'Successfully update user info.',
        };
      }
      const query = await db
        .update(user)
        .set({
          companyAccountNumber: Number(companyAccNo),
          companyAccountType: companyAccType,
          companyBank,
          companyBranchCode: Number(companyBranchCode),
          companyName,
          contactNumber,
          email: emailAddress,
          name,
        })
        .where(eq(user.id, session.user.id));

      if (!query) throw new Error('Something went wrong.');

      revalidatePath('/dashboard/settings');

      return {
        success: 'Successfully update user info.',
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
