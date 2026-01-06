'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { use } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateClientFn } from '@/actions/updateClient';
import { customerSchema, CustomerType } from '@/lib/schemas';

type Props = {
  data: Promise<
    | {
        id: string;
        email: string;
        contactNumber: string;
        createdAt: Date;
        customerName: string;
        billingAddress: string;
        sellerId: string;
      }
    | undefined
  >;
  clientId: string;
};

export default function EditClient({ clientId, data }: Props) {
  const route = useRouter();

  const result = use(data);

  const form = useForm<CustomerType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      billingAddress: result?.billingAddress || '',
      contactNumber: result?.contactNumber || '',
      customerName: result?.customerName || '',
      email: result?.email || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = async (values: CustomerType) => {
    const result = await updateClientFn(values, clientId);

    if (result?.error) {
      return toast.error('Error', {
        description: result.error,
      });
    } else if (result?.success) {
      toast.success('Success', {
        description: result.success,
      });

      return route.refresh();
    }
  };

  if (result)
    return (
      <form
        id='update-client-form'
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-200'
      >
        <FieldGroup>
          <Controller
            name='customerName'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='update-client-form-name'>
                  Client Name
                </FieldLabel>
                <FieldDescription>
                  The full name as it should appear on invoices and quotations.
                </FieldDescription>
                <Input
                  {...field}
                  id='update-client-form-name'
                  aria-invalid={fieldState.invalid}
                  placeholder='John Doe'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='update-client-form-email'>
                  Client Email
                </FieldLabel>
                <FieldDescription>
                  The main email address used for communication and
                  notifications.
                </FieldDescription>
                <Input
                  {...field}
                  type='email'
                  id='update-client-form-email'
                  aria-invalid={fieldState.invalid}
                  placeholder='johndoe@mail.com'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name='contactNumber'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='update-client-form-number'>
                  Client Contact Number
                </FieldLabel>
                <FieldDescription>
                  A phone number you can use to quicklly reach the client if
                  needed.
                </FieldDescription>
                <Input
                  {...field}
                  id='update-client-form-number'
                  aria-invalid={fieldState.invalid}
                  placeholder='+1245789635'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name='billingAddress'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='update-client-form-address'>
                  Client Billing Address
                </FieldLabel>
                <FieldDescription>
                  The official address used for billing and tax purposes.
                </FieldDescription>
                <Textarea
                  {...field}
                  id='update-client-form-address'
                  aria-invalid={fieldState.invalid}
                  placeholder='Some random place, place, random'
                  className='resize-none'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-fit ml-auto'
          >
            {isSubmitting && <Spinner />}
            Update Client
          </Button>
        </FieldGroup>
      </form>
    );
}
