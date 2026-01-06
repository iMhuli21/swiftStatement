'use client';

import { use } from 'react';
import { useColumns } from './columns';
import { DataTable } from './data-table';

type Props = {
  data: Promise<
    {
      id: string;
      email: string;
      contactNumber: string;
      createdAt: Date;
      customerName: string;
      billingAddress: string;
      sellerId: string;
      invoices: {
        id: string;
        status: 'due' | 'paid' | null;
        total: number;
      }[];
      quotations: {
        id: string;
        status: 'due' | 'paid' | null;
        total: number;
      }[];
    }[]
  >;
};

export default function ManageClients({ data }: Props) {
  const result = use(data);
  const columns = useColumns();

  if (result) return <DataTable columns={columns} data={result} />;
}
