'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { use, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInvoice } from '@/hooks/use-invoice';
import { Calendar } from '@/components/ui/calendar';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createInvoiceFn } from '@/actions/createInvoice';
import TemplateSwitch from '@/components/template-switch';
import { invoiceSchema, InvoiceType } from '@/lib/schemas';
import { cn, currencyFormatter, toDate } from '@/lib/utils';
import { CalendarIcon, EllipsisVertical, Loader2, Trash2 } from 'lucide-react';
import PreviewInvoiceTemplateOne from '@/components/invoices/preview-template-one';
import PreviewInvoiceTemplateTwo from '@/components/invoices/preview-template-two';

type Props = {
  data: Promise<
    | {
        email: string;
        companyAccountNumber: number | null;
        companyAccountType: string | null;
        companyBranchCode: number | null;
        companyName: string | null;
        companyBank: string | null;
        contactNumber: string | null;
        logoUrl: string | null;
        template: string | null;
        customers: {
          id: string;
          email: string;
          createdAt: Date;
          customerName: string;
          contactNumber: string;
          billingAddress: string;
          sellerId: string;
        }[];
      }
    | undefined
  >;
};

export default function CreateInvoice({ data }: Props) {
  const result = use(data);

  const route = useRouter();

  const {
    addCustomer,
    addDueDate,
    addInvoiceNumber,
    addInvoicePrefix,
    addInvoiceItem,
    addTax,
    addDiscount,
    invoiceItems,
    removeItem,
    resetItems,
    customer,
    total,
  } = useInvoice();

  const [invoiceQty, setInvoiceQty] = useState(0);
  const [invoiceRate, setInvoiceRate] = useState(0);
  const [invoiceItem, setInvoiceItem] = useState('');

  const form = useForm<InvoiceType>({
    resolver: zodResolver(invoiceSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: '',
      discount: '',
      dueDate: undefined,
      invoiceNumber: '',
      invoicePrefix: '',
      vat: '',
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const invoiceTotal = useMemo(() => {
    if (invoiceQty === 0 && invoiceRate === 0) return 0;
    return invoiceQty * invoiceRate;
  }, [invoiceQty, invoiceRate]);

  const handleAddItem = () => {
    if (invoiceQty !== 0 && invoiceRate !== 0 && invoiceItem.length !== 0) {
      addInvoiceItem({
        itemDescription: invoiceItem,
        qty: invoiceQty,
        rate: invoiceRate,
        total: invoiceTotal,
      });

      setInvoiceItem('');
      setInvoiceQty(0);
      setInvoiceRate(0);
    }
  };

  const onSubmit = async (values: InvoiceType) => {
    if (customer) {
      const result = await createInvoiceFn(
        values,
        customer.id,
        invoiceItems,
        total
      );

      if (result?.error) {
        return toast.error('Error', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success('Success', {
          description: result.success,
        });
        reset({
          clientName: undefined,
          discount: '',
          dueDate: undefined,
          invoiceNumber: '',
          invoicePrefix: '',
          vat: '',
        });

        resetItems();

        return route.refresh();
      }
    }
  };

  return (
    <div className='space-y-4'>
      <TemplateSwitch template={result?.template} />
      <div className='flex flex-col items-start gap-7'>
        <form
          id='create-invoice-form'
          onSubmit={handleSubmit(onSubmit)}
          className='w-full max-w-200'
        >
          <FieldGroup>
            <Controller
              name='clientName'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='create-invoice-form-name'>
                    Bill To
                  </FieldLabel>
                  <FieldDescription>
                    Select the client who will receive and pay this invoice.
                  </FieldDescription>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(val) => {
                      if (result?.customers) {
                        const cust = result.customers.filter(
                          (item) => item.customerName === val
                        );
                        addCustomer(cust[0]);
                      }
                      field.onChange(val);
                    }}
                  >
                    <SelectTrigger suppressHydrationWarning>
                      <SelectValue placeholder='Select customer' />
                    </SelectTrigger>
                    <SelectContent className='w-full'>
                      {result?.customers &&
                        result.customers.map((item) => (
                          <SelectItem
                            className='capitalize'
                            key={item.id}
                            value={item.customerName}
                          >
                            {item.customerName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='dueDate'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Due Date</FieldLabel>
                  <FieldDescription>
                    The date by which payment is expected.
                  </FieldDescription>
                  <Popover>
                    <PopoverTrigger asChild suppressHydrationWarning>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full flex items-center justify-start gap-2 border-input',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='h-4 w-4 opacity-50' />
                        {field.value ? (
                          format(toDate(field.value), 'PPP')
                        ) : (
                          <span className='text-start'>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(selected) => {
                          if (typeof selected !== undefined) {
                            addDueDate(selected);
                          }
                          field.onChange(selected);
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Popover>
                </Field>
              )}
            />

            <Controller
              name='invoicePrefix'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Invoice Prefix</FieldLabel>
                  <FieldDescription>
                    A short label added before the invoice number to help
                    organize invoices (for example, INV-)
                  </FieldDescription>
                  <Input
                    {...field}
                    className='uppercase'
                    onChange={(e) => {
                      addInvoicePrefix(e.target.value);
                      field.onChange(e);
                    }}
                    placeholder='ACME'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='invoiceNumber'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Invoice Number</FieldLabel>
                  <FieldDescription>
                    A unique reference used to identify and track this invoice.
                  </FieldDescription>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => {
                      addInvoiceNumber(e.target.value);
                      field.onChange(e);
                    }}
                    placeholder='21'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='discount'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Discount (%)</FieldLabel>
                  <FieldDescription>
                    The date by which payment is expected.
                  </FieldDescription>
                  <Input
                    {...field}
                    type='number'
                    placeholder='5'
                    onChange={(e) => {
                      addDiscount(e.target.value);
                      field.onChange(e);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='vat'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tax (%)</FieldLabel>
                  <FieldDescription>
                    Applicable tax added to the invoice based on your rates.
                  </FieldDescription>
                  <Input
                    {...field}
                    type='number'
                    placeholder='15'
                    onChange={(e) => {
                      addTax(e.target.value);
                      field.onChange(e);
                    }}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className='flex flex-col items-start gap-2'>
              <Table>
                <TableHeader className='bg-neutral-50'>
                  <TableRow>
                    <TableHead className='w-115'>Item Description</TableHead>
                    <TableHead className='w-24'>Qty</TableHead>
                    <TableHead className='w-24'>Rate</TableHead>
                    <TableHead className='w-30'>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.length > 0 &&
                    invoiceItems.map((item) => (
                      <TableRow key={`${item.itemDescription}-${item.rate}`}>
                        <TableCell className='h-9 px-2.5 py-1'>
                          {item.itemDescription}
                        </TableCell>
                        <TableCell className='h-9 px-2.5 py-1'>
                          {item.qty}
                        </TableCell>
                        <TableCell className='h-9 px-2.5 py-1'>
                          {currencyFormatter(item.rate.toString())}
                        </TableCell>
                        <TableCell className='h-9 px-2.5 py-1'>
                          {currencyFormatter(item.total.toString())}
                        </TableCell>
                        <TableCell className='h-9 px-2.5 py-1'>
                          <DropdownMenu>
                            <DropdownMenuTrigger suppressHydrationWarning>
                              <EllipsisVertical className='size-4' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => removeItem(item.itemDescription)}
                              >
                                Remove Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell className='p-0'>
                      <Input
                        value={invoiceItem}
                        onChange={(e) => setInvoiceItem(e.target.value)}
                        placeholder='Web Design'
                        className='border-none shadow-none focus-visible:ring-0'
                      />
                    </TableCell>
                    <TableCell className='p-0'>
                      <Input
                        type='number'
                        value={invoiceQty}
                        onChange={(e) => setInvoiceQty(Number(e.target.value))}
                        placeholder='1'
                        className='border-none shadow-none p-2 focus-visible:ring-0'
                      />
                    </TableCell>
                    <TableCell className='p-0'>
                      <Input
                        type='number'
                        value={invoiceRate}
                        onChange={(e) => setInvoiceRate(Number(e.target.value))}
                        placeholder='1'
                        className='border-none shadow-none p-2 focus-visible:ring-0'
                      />
                    </TableCell>
                    <TableCell className='h-9 px-2.5 py-1'>
                      {currencyFormatter(invoiceTotal.toString())}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className='flex items-center gap-2 mt-3'>
                <Button
                  type='button'
                  size={'sm'}
                  variant='outline'
                  className='bg-accent'
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='flex items-center gap-2'
                  onClick={resetItems}
                >
                  <Trash2 className='flex-none w-2 h-2 opacity-70' />
                  Clear Items
                </Button>
              </div>
            </div>
            <div className='flex justify-end'>
              <Button type='submit' disabled={isSubmitting} className='w-fit'>
                {isSubmitting && (
                  <Loader2 className='w-4 h-4 flex-none animate-spin mr-1' />
                )}
                Save Invoice
              </Button>
            </div>
          </FieldGroup>
        </form>
        <div className='bg-neutral-100 border border-neutral-200 rounded-xl p-7 shadow-xs space-y-5 h-full w-200 overflow-x-auto relative'>
          <h3 className='font-semibold text-xl tracking-tight'>Preview</h3>
          {result?.template === 'template1' ? (
            <PreviewInvoiceTemplateOne
              invoiceDetails={{
                user: {
                  companyName: result?.companyName,
                  contactNumber: result?.contactNumber,
                  email: result?.email,
                  companyAccountNumber: result?.companyAccountNumber,
                  companyAccountType: result?.companyAccountType,
                  companyBank: result?.companyBank,
                  companyBranchCode: result?.companyBranchCode,
                },
              }}
            />
          ) : (
            <PreviewInvoiceTemplateTwo
              invoiceDetails={{
                user: {
                  companyName: result?.companyName,
                  contactNumber: result?.contactNumber,
                  email: result?.email,
                  companyAccountNumber: result?.companyAccountNumber,
                  companyAccountType: result?.companyAccountType,
                  companyBank: result?.companyBank,
                  companyBranchCode: result?.companyBranchCode,
                  logoUrl: result?.logoUrl,
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
