import { format } from 'date-fns';
import { Invoice as InvoiceType } from '@/lib/db/schema';
import { cn, currencyFormatter, toDate } from '@/lib/utils';

type Props = {
  invoice: InvoiceType;
  customer: string | null | undefined;
};

export default function Invoice({ invoice, customer }: Props) {
  return (
    <div className='border border-input rounded-md shadow-xs p-4 max-w-100 w-full'>
      <div className='flex items-center justify-between w-full'>
        <h5 className='font-semibold tracking-tight'>Invoice</h5>
        <span className='text-sm uppercase'>
          {invoice.invoiceNumber
            ? `${invoice.invoicePrefix}-${invoice.invoiceNumber}`
            : `${invoice.invoicePrefix}-
          ${invoice.id.slice(invoice.id.length - 7, invoice.id.length)}`}
        </span>
      </div>
      <div className='flex items-center justify-between mt-2 mb-1'>
        <div>
          <span
            className={cn(
              invoice.status === 'due'
                ? 'capitalize w-fit text-sm font-medium text-destructive/60 '
                : 'capitalize w-fit text-sm font-medium text-emerald-600'
            )}
          >
            {invoice.status}
          </span>
        </div>

        <span className='text-lg font-semibold'>
          {currencyFormatter(String(invoice.total))}
        </span>
      </div>
      <div className='flex items-center justify-between opacity-50 text-sm'>
        <span className='capitalize'>{customer}</span>
        <span>Due: {format(toDate(invoice.dueDate), 'dd/MM/yyyy')}</span>
      </div>
    </div>
  );
}
