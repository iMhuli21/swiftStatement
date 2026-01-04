'use server';

import { user } from './schema';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';

export async function getInvoiceTemplateInfo(userId: string) {
  const result = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      companyAccountNumber: true,
      companyAccountType: true,
      companyName: true,
      companyBranchCode: true,
      logoUrl: true,
      email: true,
      template: true,
      companyBank: true,
      contactNumber: true,
    },
    with: {
      customers: true,
    },
  });
  return result;
}

export async function getUserAccountInfo(userId: string) {
  const result = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      emailVerified: false,
    },
  });

  return result;
}
