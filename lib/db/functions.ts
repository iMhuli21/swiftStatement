'use server';

import { db } from '@/lib/db/drizzle';
import { and, or, eq, exists, count } from 'drizzle-orm';
import { customer, invoice, quote } from './schema';
import { maxItems } from '../constants';

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

export async function getQuotation(quoteId: string, userId: string) {
  const quotation = await db.query.quote.findFirst({
    where: (quote, { eq, and }) =>
      and(eq(quote.id, quoteId), eq(quote.authorId, userId)),
    with: {
      author: {
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
      },
      billing: true,
      items: true,
    },
  });

  return quotation;
}

export async function getInvoice(invoiceId: string, userId: string) {
  const invoice = await db.query.invoice.findFirst({
    where: (invoice, { eq, and }) =>
      and(eq(invoice.id, invoiceId), eq(invoice.authorId, userId)),
    with: {
      author: {
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
      },
      billing: true,
      items: true,
    },
  });

  return invoice;
}

export async function getClients(userId: string, tab: string | undefined) {
  if (tab) {
    if (tab === 'due') {
      const clients = await db.query.customer.findMany({
        where: (customer, { eq, and, or, exists }) =>
          and(
            eq(customer.sellerId, userId),
            or(
              exists(
                db
                  .select({ id: invoice.id })
                  .from(invoice)
                  .where(
                    and(
                      eq(invoice.billingId, customer.id),
                      eq(invoice.status, 'due')
                    )
                  )
              ),
              exists(
                db
                  .select({ id: quote.id })
                  .from(quote)
                  .where(
                    and(
                      eq(quote.billingId, customer.id),
                      eq(quote.status, 'due')
                    )
                  )
              )
            )
          ),

        with: {
          invoices: {
            columns: {
              id: true,
              status: true,
              total: true,
            },
          },
          quotations: {
            columns: {
              id: true,
              status: true,
              total: true,
            },
          },
        },
      });

      return clients;
    } else if (tab === 'paid') {
      const clients = await db.query.customer.findMany({
        where: (customer, { eq, and, or, exists }) =>
          and(
            eq(customer.sellerId, userId),
            or(
              exists(
                db
                  .select({ id: invoice.id })
                  .from(invoice)
                  .where(
                    and(
                      eq(invoice.billingId, customer.id),
                      eq(invoice.status, 'paid')
                    )
                  )
              ),
              exists(
                db
                  .select({ id: quote.id })
                  .from(quote)
                  .where(
                    and(
                      eq(quote.billingId, customer.id),
                      eq(quote.status, 'paid')
                    )
                  )
              )
            )
          ),

        with: {
          invoices: {
            columns: {
              id: true,
              status: true,
              total: true,
            },
          },
          quotations: {
            columns: {
              id: true,
              status: true,
              total: true,
            },
          },
        },
      });

      return clients;
    }
  }
  const clients = await db.query.customer.findMany({
    where: (customer, { eq }) => eq(customer.sellerId, userId),
    with: {
      invoices: {
        columns: {
          id: true,
          status: true,
          total: true,
        },
      },
      quotations: {
        columns: {
          id: true,
          status: true,
          total: true,
        },
      },
    },
  });

  return clients;
}

export async function getClient(clientId: string, userId: string) {
  const client = await db.query.customer.findFirst({
    where: (customer, { eq, and }) =>
      and(eq(customer.id, clientId), eq(customer.sellerId, userId)),
  });
  return client;
}

export async function getCustomerDocuments(
  customerId: string,
  userId: string,
  currentPage?: string
) {
  const page = currentPage ? Number(currentPage) : 1;

  const invoicesPromise = db.query.invoice.findMany({
    where: (invoice, { eq, and }) =>
      and(eq(invoice.billingId, customerId), eq(invoice.authorId, userId)),
    limit: maxItems,
    offset: (page - 1) * maxItems,
  });

  const quotationsPromise = db.query.quote.findMany({
    where: (quote, { eq, and }) =>
      and(eq(quote.billingId, customerId), eq(quote.authorId, userId)),
    limit: maxItems,
    offset: (page - 1) * maxItems,
  });

  const customerPromise = db.query.customer.findFirst({
    where: (customer, { eq }) => eq(customer.id, customerId),
    columns: {
      customerName: true,
    },
  });

  const invoiceCountPromise = db
    .select({ value: count() })
    .from(invoice)
    .where(
      and(eq(invoice.billingId, customerId), eq(invoice.authorId, userId))
    );

  const quotationsCountPromise = db
    .select({ value: count() })
    .from(quote)
    .where(and(eq(quote.billingId, customerId), eq(quote.authorId, userId)));

  const [invoices, customer, quotations, invoiceCount, quotationCount] =
    await Promise.all([
      invoicesPromise,
      customerPromise,
      quotationsPromise,
      invoiceCountPromise,
      quotationsCountPromise,
    ]);

  const invoiceNumPages = Math.ceil(invoiceCount[0].value / maxItems);
  const quotationNumPages = Math.ceil(quotationCount[0].value / maxItems);

  return { invoices, customer, quotations, invoiceNumPages, quotationNumPages };
}

export async function getDashboardInfo(userId: string) {
  const invoicesPromise = db
    .select({ total: invoice.total })
    .from(invoice)
    .where(and(eq(invoice.authorId, userId), eq(invoice.status, 'paid')));

  const quotationsPromise = db
    .select({ total: quote.total })
    .from(quote)
    .where(and(eq(quote.authorId, userId), eq(quote.status, 'paid')));

  const clientsPromise = db
    .select({ count: count() })
    .from(customer)
    .where(eq(customer.sellerId, userId));

  const [invoices, quotations, clients] = await Promise.all([
    invoicesPromise,
    quotationsPromise,
    clientsPromise,
  ]);

  return {
    invoices,
    quotations,
    clients: clients[0].count,
  };
}
