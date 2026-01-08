'use client';

import { use } from 'react';
import { Customer } from '@/lib/db/schema';
import { columns } from './columns';
import { DataTable } from './data-table';

type Props = {
  data: Promise<
    {
      id: string;
      createdAt: Date;
      status: 'due' | 'paid' | null;
      dueDate: string;
      total: number;
      lastUpdatedAt: Date;
      vat: number;
      discount: number;
      authorId: string;
      billingId: string;
      invoicePrefix: string;
      invoiceNumber: number | null;
      items: {
        id: string;
        total: number;
        itemDescription: string;
        qty: number;
        rate: number;
        invoiceId: string;
      }[];
      author: {
        email: string;
        companyAccountNumber: string | null;
        companyAccountType: string | null;
        companyBranchCode: number | null;
        companyName: string | null;
        companyBank: string | null;
        contactNumber: string | null;
        logoUrl: string | null;
        template: string | null;
        customers: Customer[];
      };
      billing: Customer;
    }[]
  >;
};

export default function ManageInvoices({ data }: Props) {
  const result = use(data);

  if (result)
    return (
      <div>
        <DataTable columns={columns} data={result} />
      </div>
    );
}
