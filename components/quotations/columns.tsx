import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { cn, currencyFormatter, toDate } from '@/lib/utils';
import { Customer, QuoteItem, Status } from '@/lib/db/schema';
import DeleteQuoteBtn from '@/components/quotations/delete-quote-btn';
// import ExportTemplateOne from '@/components/exportTemplate1';
// import ExportTemplateTwo from '@/components/exportTemplate2';

type Quote = {
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
    companyAccountNumber: number | null;
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
};

export const columns: ColumnDef<Quote>[] = [
  {
    id: 'quoteNumber',
    accessorFn: (quote) => {
      const number = `${quote.quotePrefix}-${quote.quoteNumber}`;
      return number.toUpperCase();
    },
    header: 'Quote Number',
    cell({ row }) {
      const quote = row.original;

      return (
        <p className='tracking-tight uppercase'>
          {`${quote.quotePrefix}-${quote.quoteNumber}`}
        </p>
      );
    },
  },
  {
    id: 'billing.customerName',
    accessorKey: 'billing.customerName',
    header: 'Client',
    cell({ row }) {
      return (
        <p className='capitalize'>{row.getValue('billing.customerName')}</p>
      );
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
      const date = format(
        toDate(row.getValue('createdAt')),
        'dd MMM yyyy, hh:mm a.'
      );

      return <p suppressHydrationWarning>{date}</p>;
    },
  },
  {
    accessorKey: 'lastUpdatedAt',
    header: 'Last Updated',
    cell({ row }) {
      const date = format(
        toDate(row.getValue('lastUpdatedAt')),
        'dd MMM yyyy, hh:mm a.'
      );

      return <p suppressHydrationWarning>{date}</p>;
    },
  },
  {
    accessorKey: 'total',
    header: 'Amount',
    cell({ row }) {
      const amount = currencyFormatter(row.getValue('total'));
      return <p suppressHydrationWarning>{amount}</p>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell({ row }) {
      const status = row.getValue('status') as Status;

      return (
        <p
          className={cn(
            status === 'due'
              ? 'capitalize w-fit text-sm font-medium text-destructive/60 '
              : 'capitalize w-fit text-sm font-medium text-emerald-600'
          )}
        >
          {status}
        </p>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild suppressHydrationWarning>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <DeleteQuoteBtn id={data.id} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/dashboard/quotations/edit/${data.id}`}>
                Edit Quote
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='flex items-center'>
              {/* {data.author.template === 'template1' ? (
                <ExportTemplateOne invoiceDetails={data} />
              ) : (
                <ExportTemplateTwo invoiceDetails={data} />
              )} */}
              Export Quote
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
