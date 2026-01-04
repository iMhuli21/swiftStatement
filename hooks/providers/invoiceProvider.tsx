'use client';

import { Customer, InvoiceItem } from '@/lib/db/schema';
import { InvoiceItems } from '@/lib/constants';
import { createContext, ReactNode, useMemo, useState } from 'react';

type InvoiceContextType = {
  discount: string;
  discountAmount: number;
  tax: string;
  taxAmount: number;
  invoiceItems: InvoiceItems[];
  subtotal: number;
  total: number;
  invoiceNumber: string;
  dueDate: Date | undefined;
  invoicePrefix: string;
  customer: Customer | undefined;
  addCustomer: (obj: Customer) => void;
  addInvoiceNumber: (invoiceNumber: string) => void;
  addDueDate: (dueDate: Date | undefined) => void;
  addInvoicePrefix: (invoicePrefix: string) => void;
  addInvoiceItem: (obj: InvoiceItems) => void;
  addDiscount: (amount: string) => void;
  addTax: (amount: string) => void;
  resetItems: () => void;
  removeItem: (itemName: string) => void;
  addInvoiceItems: (obj: InvoiceItem[]) => void;
};

export const invoiceContext = createContext<InvoiceContextType | null>(null);

export default function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItems[]>([]);
  const [discount, setDiscount] = useState<string>('');
  const [tax, setTax] = useState<string>('');
  const [customer, setCustomer] = useState<Customer>();
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [invoicePrefix, setInvoicePrefix] = useState<string>('');

  function addCustomer(customer: Customer) {
    setCustomer(customer);
  }

  function addInvoiceNumber(invoiceNumber: string) {
    setInvoiceNumber(invoiceNumber);
  }

  function addDueDate(dueDate: Date | undefined) {
    setDueDate(dueDate);
  }

  function addInvoicePrefix(invoicePrefix: string) {
    setInvoicePrefix(invoicePrefix);
  }

  function addInvoiceItem(item: InvoiceItems) {
    setInvoiceItems((prev) => [...prev, item]);
  }

  function addInvoiceItems(items: InvoiceItem[]) {
    setInvoiceItems(
      items.map((item) => ({
        itemDescription: item.itemDescription,
        qty: item.qty,
        rate: item.rate,
        total: item.total,
      }))
    );
  }

  function removeItem(itemName: string) {
    setInvoiceItems((prev) =>
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
    setInvoiceItems([]);
    setDiscount('');
    setTax('');
    setCustomer(undefined);
    setDueDate(undefined);
    setInvoicePrefix('');
    setInvoiceNumber('');
  }

  const subtotal = useMemo(() => {
    return invoiceItems.reduce((sum, item) => sum + item.total, 0);
  }, [invoiceItems]);

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
    <invoiceContext.Provider
      value={{
        customer,
        discount,
        discountAmount,
        dueDate,
        invoiceNumber,
        invoicePrefix,
        invoiceItems,
        subtotal,
        tax,
        taxAmount,
        total,
        addCustomer,
        addDueDate,
        addInvoiceNumber,
        addInvoicePrefix,
        addDiscount,
        addInvoiceItem,
        addInvoiceItems,
        addTax,
        resetItems,
        removeItem,
      }}
    >
      {children}
    </invoiceContext.Provider>
  );
}
