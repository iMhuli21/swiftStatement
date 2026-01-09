'use client';

import { use } from 'react';
import Pagination from '@/components/pagination';
import Quote from '@/components/quotations/quote';
import Invoice from '@/components/invoices/invoice';
import Headertitle from '@/components/header-title';
import DocumentSwitch from '@/components/document-switch';
import { usePathname, useSearchParams } from 'next/navigation';
import { Invoice as InvoiceType, Quotation } from '@/lib/db/schema';

type Props = {
  data: Promise<{
    quotations: Quotation[];
    invoices: InvoiceType[];
    customer:
      | {
          customerName: string;
        }
      | undefined;
    invoiceNumPages: number;
    quotationNumPages: number;
  }>;
};

export default function ManageCustomerDocuments({ data }: Props) {
  const result = use(data);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(!searchParams.get('tab') ? 'no tab' : 'tab');

  if (result)
    return (
      <div className='space-y-5'>
        <Headertitle title={`'${result.customer?.customerName}' Documents`} />
        <DocumentSwitch />
        {!searchParams.get('tab') || searchParams.get('tab') === 'invoices' ? (
          <div className='min-h-dvh space-y-5 flex flex-col justify-between w-full'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
              {result.invoices.map((item) => (
                <Invoice
                  key={item.id}
                  invoice={item}
                  customer={result.customer?.customerName}
                />
              ))}
            </div>
            {result.invoices.length > 0 && (
              <Pagination
                href={pathname}
                numberOfPages={result.invoiceNumPages}
              />
            )}
          </div>
        ) : (
          ''
        )}
        {searchParams.get('tab') === 'quotations' ? (
          <div className='min-h-dvh space-y-5 flex flex-col justify-between'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>
              {result.quotations.map((item) => (
                <Quote
                  key={item.id}
                  quote={item}
                  customer={result.customer?.customerName}
                />
              ))}
            </div>
            {result.quotations.length > 0 && (
              <Pagination
                href={pathname}
                numberOfPages={result.quotationNumPages}
              />
            )}
          </div>
        ) : (
          ''
        )}
        {result.invoices.length === 0 && result.quotations.length === 0 ? (
          <div className='min-h-dvh font-medium tracking-tight text-base flex items-center justify-center'>
            No results.
          </div>
        ) : (
          ''
        )}
      </div>
    );
}
