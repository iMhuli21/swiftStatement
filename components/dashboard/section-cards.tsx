'use client';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { use, useMemo } from 'react';
import { currencyFormatter } from '@/lib/utils';

type Props = {
  data: Promise<{
    invoices: {
      total: number;
    }[];
    quotations: {
      total: number;
    }[];
    clients: number;
  }>;
};

export function SectionCards({ data }: Props) {
  const result = use(data);

  const revenue = useMemo(() => {
    if (result) {
      return [...result.invoices, ...result.quotations].reduce(
        (sum, item) => sum + item.total,
        0
      );
    }
    return 0;
  }, [result]);

  return (
    <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {currencyFormatter(revenue.toString())}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Customers</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {result.clients}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Invoices</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {result.invoices.length}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Quotations</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {result.quotations.length}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
