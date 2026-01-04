import { use } from 'react';
import { invoiceContext } from './providers/invoiceProvider';

export function useInvoice() {
  const context = use(invoiceContext);

  if (!context) {
    throw new Error('Cannot use useInvoice hook outside of invoiceProvider.');
  }
  return context;
}
