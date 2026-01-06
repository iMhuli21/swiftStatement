import { format } from 'date-fns';
import { Quotation } from '@/lib/db/schema';
import { cn, currencyFormatter, toDate } from '@/lib/utils';

type Props = {
  quote: Quotation;

  customer: string | null | undefined;
};

export default function Quote({ quote, customer }: Props) {
  return (
    <div className='border border-input shadow-[9px_5px] shadow-primary p-4 rounded-md w-70'>
      <div className='flex items-center justify-between w-full'>
        <h5 className='font-semibold tracking-tight'>Quote</h5>
        <span className='text-sm uppercase'>
          {quote.quoteNumber
            ? `${quote.quotePrefix}-${quote.quoteNumber}`
            : `${quote.quotePrefix}-
          ${quote.id.slice(quote.id.length - 7, quote.id.length)}`}
        </span>
      </div>
      <div className='flex items-center justify-between mt-2 mb-1'>
        <div>
          <span
            className={cn(
              quote.status === 'due'
                ? 'capitalize w-fit text-sm font-medium text-destructive/60 '
                : 'capitalize w-fit text-sm font-medium text-emerald-600'
            )}
          >
            {quote.status}
          </span>
        </div>

        <span className='text-lg font-semibold'>
          {currencyFormatter(String(quote.total))}
        </span>
      </div>
      <div className='flex items-center justify-between opacity-50 text-sm'>
        <span className='capitalize'>{customer}</span>
        <span>Due: {format(toDate(quote.validDate), 'dd/MM/yyyy')}</span>
      </div>
    </div>
  );
}
