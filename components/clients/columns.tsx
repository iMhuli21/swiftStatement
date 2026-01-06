import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { format } from 'date-fns';
import { type Status } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { cn, currencyFormatter, toDate } from '@/lib/utils';

export type CustomerData = {
  invoices: {
    id: string;
    total: number;
    status: Status | null;
  }[];
} & {
  quotations: {
    id: string;
    total: number;
    status: Status | null;
  }[];
} & {
  id: string;
  email: string;
  contactNumber: string;
  createdAt: Date;
  customerName: string;
  billingAddress: string;
  sellerId: string;
};

export function useColumns() {
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab') as string;

  const columns: ColumnDef<CustomerData>[] = [
    {
      accessorKey: 'customerName',
      header: 'Client',
      cell({ row }) {
        return <p className='capitalize'>{row.getValue('customerName')}</p>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell({ row }) {
        const formattedDate = format(
          toDate(row.getValue('createdAt')),
          'dd MMM yyyy, hh:mm a'
        );

        return <p suppressHydrationWarning>{formattedDate}</p>;
      },
    },
    {
      accessorKey: 'billingAddress',
      header: 'Billing Address',
    },
    {
      accessorKey: 'contactNumber',
      header: 'Contact No',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      id: 'documents',
      accessorKey: 'invoices',
      header: 'Documents',
      cell({ row }) {
        const data = row.original;

        if (tab === 'due') {
          const dueInvItems = data.invoices.filter(
            (item) => item.status === 'due'
          );
          const dueQuoItems = data.quotations.filter(
            (item) => item.status === 'due'
          );

          return <p>{dueInvItems.length + dueQuoItems.length}</p>;
        } else if (tab === 'paid') {
          const paidInvItems = data.invoices.filter(
            (item) => item.status === 'paid'
          );
          const paidQuoItems = data.quotations.filter(
            (item) => item.status === 'paid'
          );

          return <p>{paidInvItems.length + paidQuoItems.length}</p>;
        }

        return <p>{data.invoices.length + data.quotations.length}</p>;
      },
    },

    {
      id: 'invoices-amount',
      accessorKey: 'invoices',
      header: 'Amount',
      cell({ row }) {
        const data = row.original;

        if (tab === 'due') {
          const dueInvItems = data.invoices
            .filter((item) => item.status === 'due')
            .map((item) => item.total);

          const dueQuoItems = data.quotations
            .filter((item) => item.status === 'due')
            .map((item) => item.total);

          const dueItems = [...dueInvItems, ...dueQuoItems];

          const grandTotal = dueItems.reduce((prev, curr) => prev + curr, 0);

          return (
            <p suppressHydrationWarning>
              {currencyFormatter(String(grandTotal))}
            </p>
          );
        } else if (tab === 'paid') {
          const paidInvItems = data.invoices
            .filter((item) => item.status === 'paid')
            .map((item) => item.total);

          const paidQuoItems = data.quotations
            .filter((item) => item.status === 'paid')
            .map((item) => item.total);

          const paidItems = [...paidInvItems, ...paidQuoItems];

          const grandTotal = paidItems.reduce((prev, curr) => prev + curr, 0);
          return (
            <p suppressHydrationWarning>
              {currencyFormatter(String(grandTotal))}
            </p>
          );
        }

        const dueInvItems = data.invoices
          .filter((item) => item.status === 'due')
          .map((item) => item.total);

        const dueQuoItems = data.quotations
          .filter((item) => item.status === 'due')
          .map((item) => item.total);

        const dueItems = [...dueInvItems, ...dueQuoItems];

        const paidItems = [
          ...data.invoices.map((item) => item.total),
          ...data.quotations.map((item) => item.total),
        ];

        const grandTotal =
          dueItems.length > 0
            ? dueItems.reduce((prev, curr) => prev + curr, 0)
            : paidItems.reduce((prev, curr) => prev + curr, 0);

        return (
          <p suppressHydrationWarning>
            {currencyFormatter(String(grandTotal))}
          </p>
        );
      },
    },
    {
      id: 'invoices.status',
      accessorKey: 'invoices.status',
      header: 'Status',
      cell({ row }) {
        const data = row.original;

        if (tab === 'due') {
          return (
            <p
              className={
                'capitalize w-fit text-sm font-medium text-destructive/60'
              }
            >
              {'Due'}
            </p>
          );
        } else if (tab === 'paid') {
          return (
            <p
              className={
                'capitalize w-fit text-sm font-medium text-emerald-600'
              }
            >
              {'Paid'}
            </p>
          );
        }

        const dueInv = data.invoices.filter((item) => item.status === 'due');

        const dueQuo = data.quotations.filter((item) => item.status === 'due');

        const isDue = [...dueInv, ...dueQuo];

        return (
          <p
            className={cn(
              isDue.length > 0
                ? 'capitalize w-fit text-sm text-destructive/60 '
                : data.invoices.length > 0 && isDue.length === 0
                ? 'capitalize w-fit text-sm text-emerald-600'
                : 'capitalize w-fit text-sm'
            )}
          >
            {data.invoices.length > 0 && isDue.length > 0
              ? 'Due'
              : data.invoices.length > 0 && isDue.length === 0
              ? 'Paid'
              : '-'}
          </p>
        );
      },
    },
    {
      id: 'actions',
      cell({ row }) {
        const data = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/dashboard/clients/edit/${data.id}`}>
                  Edit Client
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/dashboard/clients/documents/${data.id}`}>
                  View Documents
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
