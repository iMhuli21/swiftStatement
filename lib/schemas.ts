import * as z from 'zod';

export const signUpSchema = z.object({
  email: z.email('Invalid email'),
  name: z.string().min(2, 'Name is required.'),
  password: z.string().min(8, 'Password must atleast be 8 characters long.'),
});

export type SignUpType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email('Invalid email.'),
  password: z.string('Password is required.'),
});

export type SignInType = z.infer<typeof signInSchema>;

export const customerSchema = z.object({
  customerName: z.string('Customer name required.'),
  email: z.email('Email is required.'),
  contactNumber: z.string('Contact number is required.'),
  billingAddress: z.string('Billing address is required.'),
});

export type CustomerType = z.infer<typeof customerSchema>;

export const invoiceSchema = z.object({
  dueDate: z.date('Due date is required.'),
  vat: z.string('Tax amount is required.'),
  clientName: z.string('Client name is required.'),
  invoicePrefix: z.string('Invoice prefix is required.'),
  discount: z.string('Discount amount is required.'),
  invoiceNumber: z.string('Invoice Number is required'),
});

export type InvoiceType = z.infer<typeof invoiceSchema>;

export const editUserInfoSchema = z.object({
  name: z.string('Your name is required.').min(2),
  contactNumber: z.string('Contact number is required.').min(2),
  emailAddress: z.email('Email is required.').min(2),
  companyName: z.string('Company name is required.').min(2),
  companyBank: z.string('Company bank info is required.').min(2),
  companyAccNo: z.string('Company account number is required.').min(2),
  companyAccType: z.string('Company account type is required.').min(2),
  companyBranchCode: z.string('Company branch code is required.').min(2),
});

export type EditUserInfoType = z.infer<typeof editUserInfoSchema>;
