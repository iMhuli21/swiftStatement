import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  uuid,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  companyAccountNumber: integer('company_account_number'),
  companyAccountType: text('company_account_type'),
  companyBranchCode: integer('company_branch_code'),
  companyName: text('company_name'),
  logoUrl: text('logo_url'),
  avatarUrl: text('avatar_url'),
  template: text('template').default('template1'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const customer = pgTable(
  'customers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    customerName: text('customer_name').notNull().unique(),
    email: text('email').notNull().unique(),
    contactNumber: text('contact_number').notNull(),
    billingAddress: text('billing_address').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    sellerId: text('seller_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('customer_sellerId_idx').on(table.sellerId)]
);

export const statusEnum = pgEnum('status', ['due', 'paid']);

export const invoice = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    dueDate: date('due_date').notNull(),
    total: integer('total').notNull(),
    status: statusEnum('status').default('due'),
    lastUpdatedAt: timestamp('last_updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    vat: integer('vat').notNull(),
    discount: integer('discount').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    billingId: uuid('billing_id')
      .notNull()
      .references(() => customer.id, { onDelete: 'cascade' }),
    invoicePrefix: text('invoice_prefix').notNull(),
    invoiceNumber: integer('invoice_number'),
  },
  (table) => [
    index('invoice_authorId_idx').on(table.authorId),
    index('invoice_billingId_idx').on(table.billingId),
  ]
);

export const quote = pgTable(
  'quotations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    validDate: date('valid_date').notNull(),
    total: integer('total').notNull(),
    status: statusEnum('status').default('due'),
    lastUpdatedAt: timestamp('last_updated_at')
      .notNull()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
    vat: text('vat').notNull(),
    discount: integer('discount').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),
    billingId: uuid('billing_id')
      .notNull()
      .references(() => customer.id, {
        onDelete: 'cascade',
      }),
    quotePrefix: text('quote_prefix').notNull(),
    quoteNumber: integer('quote_number'),
  },
  (table) => [
    index('quote_author_id_idx').on(table.authorId),
    index('quote_billing_id_idx').on(table.billingId),
  ]
);

export const invoiceItem = pgTable(
  'items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemDescription: text('item_description').notNull(),
    qty: integer('qty').notNull(),
    rate: integer('rate').notNull(),
    total: integer('total').notNull(),
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoice.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('item_invoice_id_idx').on(table.invoiceId)]
);

export const quoteItem = pgTable(
  'quote_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemDescription: text('item_description').notNull(),
    qty: integer('qty').notNull(),
    rate: integer('rate').notNull(),
    total: integer('total').notNull(),
    quoteId: uuid('quote_id')
      .notNull()
      .references(() => quote.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => [index('quote_item_quote_id_idx').on(table.quoteId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  quotes: many(quote),
  quoteItems: many(quoteItem),
  invoices: many(invoice),
  invoiceItems: many(invoiceItem),
  customers: many(customer),
}));

export const customerRelations = relations(customer, ({ one, many }) => ({
  invoices: many(invoice),
  quotations: many(quote),
  seller: one(user, {
    fields: [customer.sellerId],
    references: [user.id],
  }),
}));

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  author: one(user, {
    fields: [invoice.authorId],
    references: [user.id],
  }),
  billing: one(customer, {
    fields: [invoice.billingId],
    references: [customer.id],
  }),
  items: many(invoiceItem),
}));

export const quoteRelations = relations(quote, ({ one, many }) => ({
  author: one(user, {
    fields: [quote.authorId],
    references: [user.id],
  }),
  billing: one(customer, {
    fields: [quote.billingId],
    references: [customer.id],
  }),
  items: many(quoteItem),
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceItem.invoiceId],
    references: [invoice.id],
  }),
}));

export const quoteItemRelations = relations(quoteItem, ({ one }) => ({
  quotation: one(quote, {
    fields: [quoteItem.quoteId],
    references: [quote.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
