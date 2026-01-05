'use client';

import { Customer, QuoteItem } from '@/lib/db/schema';
import { Items } from '@/lib/constants';
import { createContext, ReactNode, useMemo, useState } from 'react';

type QuoteContextType = {
  discount: string;
  discountAmount: number;
  tax: string;
  taxAmount: number;
  quoteItems: Items[];
  subtotal: number;
  total: number;
  quoteNumber: string;
  validDate: Date | undefined;
  quotePrefix: string;
  customer: Customer | undefined;
  addCustomer: (obj: Customer) => void;
  addQuoteNumber: (quoteNumber: string) => void;
  addValidDate: (validDate: Date | undefined) => void;
  addQuotePrefix: (quotePrefix: string) => void;
  addQuoteItem: (obj: Items) => void;
  addDiscount: (amount: string) => void;
  addTax: (amount: string) => void;
  resetItems: () => void;
  removeItem: (itemName: string) => void;
  addQuoteItems: (obj: QuoteItem[]) => void;
};

export const quoteContext = createContext<QuoteContextType | null>(null);

export default function QuoteProvider({ children }: { children: ReactNode }) {
  const [quoteItems, setQuoteItems] = useState<Items[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [tax, setTax] = useState<string>('');
  const [customer, setCustomer] = useState<Customer>();
  const [quoteNumber, setQuoteNumber] = useState<string>('');
  const [validDate, setValidDate] = useState<Date | undefined>(undefined);
  const [quotePrefix, setQuotePrefix] = useState<string>('');

  function addCustomer(customer: Customer) {
    setCustomer(customer);
  }

  function addQuoteNumber(quoteNumber: string) {
    setQuoteNumber(quoteNumber);
  }

  function addValidDate(validDate: Date | undefined) {
    setValidDate(validDate);
  }

  function addQuotePrefix(quotePrefix: string) {
    setQuotePrefix(quotePrefix);
  }

  function addQuoteItem(item: Items) {
    setQuoteItems((prev) => [...prev, item]);
  }

  function addQuoteItems(items: QuoteItem[]) {
    setQuoteItems(
      items.map((item) => ({
        itemDescription: item.itemDescription,
        qty: item.qty,
        rate: item.rate,
        total: item.total,
      }))
    );
  }

  function removeItem(itemName: string) {
    setQuoteItems((prev) =>
      prev.filter((item) => item.itemDescription !== itemName)
    );
  }

  function addDiscount(amount: string) {
    setDiscount(amount);
  }

  function addTax(amount: string) {
    setTax(amount);
  }

  function resetItems() {
    setQuoteItems([]);
    setDiscount('');
    setTax('');
    setCustomer(undefined);
    setValidDate(undefined);
    setQuotePrefix('');
    setQuoteNumber('');
  }

  const subtotal = useMemo(() => {
    return quoteItems.reduce((sum, item) => sum + item.total, 0);
  }, [quoteItems]);

  const discountAmount = useMemo(() => {
    const d = Number(discount);
    if (!d) return 0;
    return (d / 100) * subtotal;
  }, [discount, subtotal]);

  const taxAmount = useMemo(() => {
    const t = Number(tax);
    if (!t) return 0;
    return (t / 100) * subtotal;
  }, [tax, subtotal]);

  const total = useMemo(() => {
    return subtotal + taxAmount - discountAmount;
  }, [subtotal, taxAmount, discountAmount]);

  return (
    <quoteContext.Provider
      value={{
        customer,
        discount,
        discountAmount,
        validDate,
        quoteNumber,
        quotePrefix,
        quoteItems,
        subtotal,
        tax,
        taxAmount,
        total,
        addCustomer,
        addValidDate,
        addQuoteNumber,
        addQuotePrefix,
        addDiscount,
        addQuoteItem,
        addQuoteItems,
        addTax,
        resetItems,
        removeItem,
      }}
    >
      {children}
    </quoteContext.Provider>
  );
}
