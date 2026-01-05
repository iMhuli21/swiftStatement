'use client';

import { format } from 'date-fns';
import { currencyFormatter } from '@/lib/utils';
import { useQuote } from '@/hooks/use-quotation';

type Props = {
  quoteDetails: {
    user: {
      contactNumber: string | null | undefined;
      email: string | null | undefined;
      companyAccountNumber: number | null | undefined;
      companyAccountType: string | null | undefined;
      companyBank: string | null | undefined;
      companyBranchCode: number | null | undefined;
      companyName: string | null | undefined;
    };
  };
};

export default function PreviewQuoteTemplateOne({
  quoteDetails: { user },
}: Props) {
  const {
    quoteNumber,
    quotePrefix,
    customer,
    quoteItems,
    discount,
    discountAmount,
    subtotal,
    tax,
    taxAmount,
    total,
  } = useQuote();

  const validDate = new Date();
  validDate.setDate(validDate.getDate() + 30);

  return (
    <div className='bg-white p-10 rounded-md shadow-xs border-input border space-y-10 w-160.5'>
      <div className='w-full space-y-6'>
        <div className='flex flex-col items-start gap-1'>
          <h1 className='font-semibold text-3xl tracking-tight'>Quote</h1>
        </div>
        <div className='flex flex-col items-start w-fit gap-1 text-sm ml-auto font-medium'>
          <p>
            {quoteNumber !== 'null'
              ? `Quotation Number: ${quotePrefix}-${quoteNumber}`
              : `Quotation Number: ${quotePrefix}-XXXXX`}
          </p>
          <p>{`Date: ${format(new Date(), 'dd MMM yyyy')}`}</p>

          <p>{`Valid Until: ${format(validDate, 'dd MMM yyyy')}`}</p>
        </div>
        <div className='flex flex-col items-start gap-6 pb-3'>
          <div className='flex flex-col items-start gap-1 text-sm'>
            <span className='opacity-50 text-xs font-medium'>From</span>
            <div className='flex flex-col items-start gap-0 text-sm font-medium'>
              <p>{user.companyName}</p>
              <p>{user.email}</p>
            </div>
          </div>
          <div className='flex flex-col items-start gap-1 text-sm'>
            <span className='opacity-50 text-xs font-medium'>Issue To</span>
            <div className='flex flex-col items-start gap-0 text-sm font-medium'>
              <p>{customer?.customerName}</p>
              <p>{customer?.email}</p>
              <p>{customer?.billingAddress}</p>
            </div>
          </div>
        </div>

        <div className='relative w-full overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-neutral-50'>
              <tr>
                <th className='font-medium text-base text-left opacity-70 w-8/12 p-2 md:text-sm'>
                  Item Description
                </th>
                <th className='font-medium text-base text-left opacity-70 w-1/12 p-2 md:text-sm'>
                  Qty
                </th>
                <th className='font-medium text-base text-left opacity-70 w-1/12 p-2 md:text-sm'>
                  Rate
                </th>
                <th className='font-medium text-base text-left opacity-70 w-2/12 p-2 md:text-sm'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {quoteItems.map((item, index) => (
                <tr key={index} className='border-b border-input'>
                  <td className='p-2 text-base md:text-sm'>
                    {item.itemDescription}
                  </td>
                  <td className='p-2 text-base md:text-sm'>{item.qty}</td>
                  <td
                    className='p-2 text-base md:text-sm'
                    suppressHydrationWarning
                  >
                    {currencyFormatter(String(item.rate))}
                  </td>
                  <td
                    className='p-2 text-base md:text-sm'
                    suppressHydrationWarning
                  >
                    {currencyFormatter(String(item.total))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='ml-auto rounded-lg max-w-75 p-4 flex flex-col gap-2 w-full'>
        <div className='flex items-center justify-between font-medium text-sm gap-4'>
          <span className='opacity-50'>Subtotal</span>
          <span suppressHydrationWarning>
            {currencyFormatter(String(subtotal))}
          </span>
        </div>
        <div className='flex items-center justify-between font-medium text-sm gap-4'>
          <span className='opacity-50'>Discount ({discount}%)</span>
          <span suppressHydrationWarning>
            {currencyFormatter(String(discountAmount))}
          </span>
        </div>
        <div className='flex items-center justify-between font-medium text-sm gap-4'>
          <span className='opacity-50'>Tax ({tax}%)</span>
          <span suppressHydrationWarning>
            {currencyFormatter(String(taxAmount))}
          </span>
        </div>
        <div className='border border-input'></div>
        <div className='flex items-center justify-between font-medium text-sm gap-4'>
          <span className='opacity-50'>Total</span>
          <span suppressHydrationWarning>
            {currencyFormatter(String(total))}
          </span>
        </div>
      </div>
      <div className='text-xs flex flex-col items-start gap-2 py-5'>
        <p className='font-medium opacity-70'>
          Please contact us for more information about invoice options.
        </p>
        <div className='font-medium opacity-70 space-y-1'>
          <p>Account Holder: {user?.companyName ? user.companyName : '-'}</p>
          <p>
            Account Number:{' '}
            {user?.companyAccountNumber ? user.companyAccountNumber : '-'}
          </p>
          <p>
            Account Type:{' '}
            {user?.companyAccountType ? user.companyAccountType : '-'}
          </p>
          <p>Bank: {user?.companyBank ? user.companyBank : '-'}</p>
          <p>
            Branch Code:{' '}
            {user?.companyBranchCode ? user.companyBranchCode : '-'}
          </p>
        </div>
        <p className='text-center w-full font-semibold tracking-tight'>
          Thank you for your business.
        </p>
      </div>
    </div>
  );
}
