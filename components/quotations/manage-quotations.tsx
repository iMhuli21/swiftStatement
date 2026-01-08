'use client';

import { use } from 'react';
import { columns } from './columns';
import { DataTable } from './data-table';
import { Customer, QuoteItem } from '@/lib/db/schema';

type Props = {
  data: Promise<
    {
      id: string;
      createdAt: Date;
      status: 'due' | 'paid' | null;
      validDate: string;
      total: number;
      lastUpdatedAt: Date;
      vat: string;
      discount: number;
      authorId: string;
      billingId: string;
      quotePrefix: string;
      quoteNumber: number | null;
      items: QuoteItem[];
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

export default function ManageQuotations({ data }: Props) {
  const result = use(data);

  if (result)
    return (
      <div>
        <DataTable columns={columns} data={result} />
      </div>
    );
}
