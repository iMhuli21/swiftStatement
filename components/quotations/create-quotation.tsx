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
import { use, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { currencyFormatter } from '@/lib/utils';
import { useQuote } from '@/hooks/use-quotation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createQuoteFn } from '@/actions/createQuotation';
import TemplateSwitch from '@/components/template-switch';
import { quoteSchema, QuotationType } from '@/lib/schemas';
import { EllipsisVertical, Loader2, Trash2 } from 'lucide-react';
import PreviewQuotationTemplateOne from '@/components/quotations/preview-template-one';
import PreviewQuotationTemplateTwo from '@/components/quotations/preview-template-two';

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

export default function CreateQuotation({ data }: Props) {
  const result = use(data);

  const route = useRouter();

  const {
    addCustomer,
    addQuoteNumber,
    addQuotePrefix,
    addQuoteItem,
    addTax,
    addDiscount,
    quoteItems,
    removeItem,
    resetItems,
    customer,
    total,
  } = useQuote();

  const [quoteQty, setQuoteQty] = useState(0);
  const [quoteRate, setQuoteRate] = useState(0);
  const [quoteItem, setQuoteItem] = useState('');

  const form = useForm<QuotationType>({
    resolver: zodResolver(quoteSchema),
    mode: 'onChange',
    defaultValues: {
      clientName: '',
      discount: '',
      quoteNumber: '',
      quotePrefix: '',
      vat: '',
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

  const onSubmit = async (values: QuotationType) => {
    if (customer) {
      const result = await createQuoteFn(
        values,
        customer.id,
        quoteItems,
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
          quoteNumber: '',
          quotePrefix: '',
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
          id='create-quotation-form'
          onSubmit={handleSubmit(onSubmit)}
          className='w-full max-w-200'
        >
          <FieldGroup>
            <Controller
              name='clientName'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='create-quotation-form-name'>
                    Bill To
                  </FieldLabel>
                  <FieldDescription>
                    Select the client who will receive and pay this quotation.
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
              name='quotePrefix'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Quotation Prefix</FieldLabel>
                  <FieldDescription>
                    A short label added before the quote number to help organize
                    quotations (for example, QUO-)
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
          {result?.template === 'template1' ? (
            <PreviewQuotationTemplateOne
              quoteDetails={{
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
            <PreviewQuotationTemplateTwo
              quoteDetails={{
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
