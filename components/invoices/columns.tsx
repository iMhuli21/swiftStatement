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
import { Customer, InvoiceItem, Status } from '@/lib/db/schema';
// import ExportTemplateOne from '@/components/exportTemplate1';
// import ExportTemplateTwo from '@/components/exportTemplate2';
import DeleteInvoiceBtn from '@/components/invoices/delete-invoice-btn';

type Invoice = {
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
  items: InvoiceItem[];
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

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'invoiceNumber',
    accessorFn: (invoice) => {
      const number = `${invoice.invoicePrefix}-${invoice.invoiceNumber}`;
      return number.toUpperCase();
    },
    header: 'Invoice Number',
    cell({ row }) {
      const invoice = row.original;

      return (
        <p className='tracking-tight uppercase'>
          {`${invoice.invoicePrefix}-${invoice.invoiceNumber}`}
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
              <DeleteInvoiceBtn id={data.id} />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/invoices/invoice/edit/${data.id}`}>
                Edit Invoice
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='flex items-center'>
              {/* {data.author.template === 'template1' ? (
                <ExportTemplateOne invoiceDetails={data} />
              ) : (
                <ExportTemplateTwo invoiceDetails={data} />
              )} */}
              Export Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
