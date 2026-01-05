import { use } from 'react';
import { quoteContext } from './providers/quotationProvider';

export function useQuote() {
  const context = use(quoteContext);

  if (!context) {
    throw new Error('Cannot use useQuote hook outside of quoteProvider.');
  }
  return context;
}
