'use server';

import { db } from '@/lib/db/drizzle';

export async function getTemplateInfo(userId: string) {
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
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      emailVerified: false,
    },
  });

  return result;
}

export async function getInvoices(userId: string, tab: string | undefined) {
  if (tab) {
    if (tab === 'due') {
      const invoices = await db.query.invoice.findMany({
        where: (invoice, { eq, and }) =>
          and(eq(invoice.authorId, userId), eq(invoice.status, 'due')),
        with: {
          author: {
            columns: {
              email: true,
              companyAccountNumber: true,
              companyAccountType: true,
              companyBank: true,
              companyBranchCode: true,
              contactNumber: true,
              companyName: true,
              logoUrl: true,
              template: true,
            },
            with: {
              customers: true,
            },
          },
          items: true,
          billing: true,
        },
      });

      return invoices;
    } else if (tab === 'paid') {
      const invoices = await db.query.invoice.findMany({
        where: (invoice, { eq, and }) =>
          and(eq(invoice.authorId, userId), eq(invoice.status, 'paid')),
        with: {
          author: {
            columns: {
              email: true,
              companyAccountNumber: true,
              companyAccountType: true,
              companyBank: true,
              companyBranchCode: true,
              contactNumber: true,
              companyName: true,
              logoUrl: true,
              template: true,
            },
            with: {
              customers: true,
            },
          },
          items: true,
          billing: true,
        },
      });

      return invoices;
    }
  }
  const invoices = await db.query.invoice.findMany({
    where: (invoice, { eq }) => eq(invoice.authorId, userId),
    with: {
      author: {
        columns: {
          email: true,
          companyAccountNumber: true,
          companyAccountType: true,
          companyBank: true,
          companyBranchCode: true,
          contactNumber: true,
          companyName: true,
          logoUrl: true,
          template: true,
        },
        with: {
          customers: true,
        },
      },
      items: true,
      billing: true,
    },
  });

  return invoices;
}

export async function getQuotations(userId: string, tab: string | undefined) {
  if (tab) {
    if (tab === 'due') {
      const quotations = await db.query.quote.findMany({
        where: (quote, { eq, and }) =>
          and(eq(quote.authorId, userId), eq(quote.status, 'due')),
        with: {
          author: {
            columns: {
              email: true,
              companyAccountNumber: true,
              companyAccountType: true,
              companyBank: true,
              companyBranchCode: true,
              contactNumber: true,
              companyName: true,
              logoUrl: true,
              template: true,
            },
            with: {
              customers: true,
            },
          },
          items: true,
          billing: true,
        },
      });

      return quotations;
    } else if (tab === 'paid') {
      const quotations = await db.query.quote.findMany({
        where: (quote, { eq, and }) =>
          and(eq(quote.authorId, userId), eq(quote.status, 'paid')),
        with: {
          author: {
            columns: {
              email: true,
              companyAccountNumber: true,
              companyAccountType: true,
              companyBank: true,
              companyBranchCode: true,
              contactNumber: true,
              companyName: true,
              logoUrl: true,
              template: true,
            },
            with: {
              customers: true,
            },
          },
          items: true,
          billing: true,
        },
      });

      return quotations;
    }
  }
  const quotations = await db.query.quote.findMany({
    where: (quote, { eq }) => eq(quote.authorId, userId),
    with: {
      author: {
        columns: {
          email: true,
          companyAccountNumber: true,
          companyAccountType: true,
          companyBank: true,
          companyBranchCode: true,
          contactNumber: true,
          companyName: true,
          logoUrl: true,
          template: true,
        },
        with: {
          customers: true,
        },
      },
      items: true,
      billing: true,
    },
  });

  return quotations;
}
