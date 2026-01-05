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
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { currencyFormatter } from '@/lib/utils';
import { useQuote } from '@/hooks/use-quotation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { use, useMemo, useState, useEffect } from 'react';
import TemplateSwitch from '@/components/template-switch';
import { updateQuoteFn } from '@/actions/updateQuotation';
import { Customer, QuoteItem, Status, statusEnum } from '@/lib/db/schema';
import { editQuoteSchema, EditQuoteType } from '@/lib/schemas';
import { EllipsisVertical, Loader2, Trash2 } from 'lucide-react';
import PreviewQuotationTemplateOne from '@/components/quotations/preview-template-one';
import PreviewQuotationTemplateTwo from '@/components/quotations/preview-template-two';

type Props = {
  data: Promise<
    | {
        id: string;
        createdAt: Date;
        validDate: string;
        total: number;
        status: Status | null;
        vat: string;
        discount: number;
        quotePrefix: string;
        quoteNumber: number | null;
        author: {
          email: string;
          companyAccountNumber: number | null;
          companyAccountType: string | null;
          companyBank: string | null;
          companyBranchCode: number | null;
          contactNumber: string | null;
          companyName: string | null;
          customers: Customer[];
          logoUrl: string | null;
          template: string | null;
        };
        billing: Customer;
        items: QuoteItem[];
      }
    | undefined
  >;
  quoteId: string;
};

export default function CreateQuotation({ data, quoteId }: Props) {
  const result = use(data);

  const route = useRouter();

  const {
    addCustomer,
    addQuoteNumber,
    addQuotePrefix,
    addQuoteItem,
    addTax,
    addDiscount,
    addQuoteItems,
    quoteItems,
    removeItem,
    resetItems,
    customer,
    total,
  } = useQuote();

  const [quoteQty, setQuoteQty] = useState(0);
  const [quoteRate, setQuoteRate] = useState(0);
  const [quoteItem, setQuoteItem] = useState('');

  const form = useForm<EditQuoteType>({
    resolver: zodResolver(editQuoteSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: result?.billing.customerName || '',
      discount: result?.discount.toString() || '',
      quoteNumber: result?.quoteNumber?.toString() || '',
      quotePrefix: result?.quotePrefix || '',
      vat: result?.vat || '',
      status: result?.status || statusEnum.enumValues[0],
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const quoteTotal = useMemo(() => {
    if (quoteQty === 0 && quoteRate === 0) return 0;
    return quoteQty * quoteRate;
  }, [quoteQty, quoteRate]);

  const handleAddItem = () => {
    if (quoteQty !== 0 && quoteRate !== 0 && quoteItem.length !== 0) {
      addQuoteItem({
        itemDescription: quoteItem,
        qty: quoteQty,
        rate: quoteRate,
        total: quoteTotal,
      });

      setQuoteItem('');
      setQuoteQty(0);
      setQuoteRate(0);
    }
  };

  const onSubmit = async (values: EditQuoteType) => {
    if (customer) {
      const result = await updateQuoteFn(
        values,
        customer.id,
        quoteItems,
        total,
        quoteId
      );

      if (result?.error) {
        return toast.error('Error', {
          description: result.error,
        });
      } else if (result?.success) {
        toast.success('Success', {
          description: result.success,
        });

        resetItems();

        return route.refresh();
      }
    }
  };

  useEffect(() => {
    if (result) {
      addCustomer(result.billing);
      addQuotePrefix(result.quotePrefix);
      addQuoteNumber(result.quoteNumber?.toString() || '');
      addDiscount(result.discount.toString());
      addTax(result.vat.toString());
      addQuoteItems(result.items);
    }
  }, [result]);

  if (result)
    return (
      <div className='space-y-4'>
        <TemplateSwitch template={result?.author.template} />
        <div className='flex flex-col items-start gap-7'>
          <form
            id='edit-quotation-form'
            onSubmit={handleSubmit(onSubmit)}
            className='w-full max-w-200'
          >
            <FieldGroup>
              <Controller
                name='clientName'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='edit-quotation-form-name'>
                      Bill To
                    </FieldLabel>
                    <FieldDescription>
                      Select the client who will receive and pay this quotation.
                    </FieldDescription>
                    <Select
                      defaultValue={field.value}
                      onValueChange={(val) => {
                        if (result?.author.customers) {
                          const cust = result.author.customers.filter(
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
                        {result?.author.customers &&
                          result.author.customers.map((item) => (
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
                name='quotePrefix'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Quotation Prefix</FieldLabel>
                    <FieldDescription>
                      A short label added before the quote number to help
                      organize quotations (for example, QUO-)
                    </FieldDescription>
                    <Input
                      {...field}
                      className='uppercase'
                      onChange={(e) => {
                        addQuotePrefix(e.target.value);
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
                name='quoteNumber'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Quotation Number</FieldLabel>
                    <FieldDescription>
                      A unique reference used to identify and track this
                      quotation.
                    </FieldDescription>
                    <Input
                      type='number'
                      {...field}
                      onChange={(e) => {
                        addQuoteNumber(e.target.value);
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
                      Applicable tax added to the quotation based on your rates.
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

              <Controller
                name='status'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <FieldDescription>
                      The status of your quotation.
                    </FieldDescription>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue
                          className='capitalize'
                          placeholder='Select status'
                        />
                      </SelectTrigger>
                      <SelectContent className='w-full'>
                        <SelectItem
                          className='capitalize'
                          value={statusEnum.enumValues[0]}
                        >
                          {statusEnum.enumValues[0]}
                        </SelectItem>
                        <SelectItem
                          className='capitalize'
                          value={statusEnum.enumValues[1]}
                        >
                          {statusEnum.enumValues[1]}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    {quoteItems.length > 0 &&
                      quoteItems.map((item) => (
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
                                  onClick={() =>
                                    removeItem(item.itemDescription)
                                  }
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
                          value={quoteItem}
                          onChange={(e) => setQuoteItem(e.target.value)}
                          placeholder='Web Design'
                          className='border-none shadow-none focus-visible:ring-0'
                        />
                      </TableCell>
                      <TableCell className='p-0'>
                        <Input
                          type='number'
                          value={quoteQty}
                          onChange={(e) => setQuoteQty(Number(e.target.value))}
                          placeholder='1'
                          className='border-none shadow-none p-2 focus-visible:ring-0'
                        />
                      </TableCell>
                      <TableCell className='p-0'>
                        <Input
                          type='number'
                          value={quoteRate}
                          onChange={(e) => setQuoteRate(Number(e.target.value))}
                          placeholder='1'
                          className='border-none shadow-none p-2 focus-visible:ring-0'
                        />
                      </TableCell>
                      <TableCell className='h-9 px-2.5 py-1'>
                        {currencyFormatter(quoteTotal.toString())}
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
                  Save Quote
                </Button>
              </div>
            </FieldGroup>
          </form>
          <div className='bg-neutral-100 border border-neutral-200 rounded-xl p-7 shadow-xs space-y-5 h-full w-200 overflow-x-auto relative'>
            <h3 className='font-semibold text-xl tracking-tight'>Preview</h3>
            {result?.author.template === 'template1' ? (
              <PreviewQuotationTemplateOne
                quoteDetails={{
                  user: {
                    companyName: result?.author.companyName,
                    contactNumber: result?.author.contactNumber,
                    email: result?.author.email,
                    companyAccountNumber: result?.author.companyAccountNumber,
                    companyAccountType: result?.author.companyAccountType,
                    companyBank: result?.author.companyBank,
                    companyBranchCode: result?.author.companyBranchCode,
                  },
                }}
              />
            ) : (
              <PreviewQuotationTemplateTwo
                quoteDetails={{
                  user: {
                    companyName: result?.author.companyName,
                    contactNumber: result?.author.contactNumber,
                    email: result?.author.email,
                    companyAccountNumber: result?.author.companyAccountNumber,
                    companyAccountType: result?.author.companyAccountType,
                    companyBank: result?.author.companyBank,
                    companyBranchCode: result?.author.companyBranchCode,
                    logoUrl: result?.author.logoUrl,
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
}
