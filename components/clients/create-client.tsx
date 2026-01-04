'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientFn } from '@/actions/createClient';
import { customerSchema, CustomerType } from '@/lib/schemas';

export default function CreateClient() {
  const route = useRouter();

  const form = useForm<CustomerType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      billingAddress: '',
      contactNumber: '',
      customerName: '',
      email: '',
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
    const result = await createClientFn(values);

    if (result?.error) {
      return toast.error('Error', {
        description: result.error,
      });
    } else if (result?.success) {
      reset({
        billingAddress: '',
        contactNumber: '',
        customerName: '',
        email: '',
      });

      toast.success('Success', {
        description: result.success,
      });

      return route.refresh();
    }
  };

  return (
    <form
      id='create-client-form'
      onSubmit={handleSubmit(onSubmit)}
      className='w-full max-w-200'
    >
      <FieldGroup>
        <Controller
          name='customerName'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-client-form-name'>
                Client Name
              </FieldLabel>
              <FieldDescription>
                The full name as it should appear on invoices and quotations.
              </FieldDescription>
              <Input
                {...field}
                id='create-client-form-name'
                aria-invalid={fieldState.invalid}
                placeholder='John Doe'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='email'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-client-form-email'>
                Client Email
              </FieldLabel>
              <FieldDescription>
                The main email address used for communication and notifications.
              </FieldDescription>
              <Input
                {...field}
                type='email'
                id='create-client-form-email'
                aria-invalid={fieldState.invalid}
                placeholder='johndoe@mail.com'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='contactNumber'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-client-form-number'>
                Client Contact Number
              </FieldLabel>
              <FieldDescription>
                A phone number you can use to quicklly reach the client if
                needed.
              </FieldDescription>
              <Input
                {...field}
                id='create-client-form-number'
                aria-invalid={fieldState.invalid}
                placeholder='+1245789635'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='billingAddress'
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='create-client-form-address'>
                Client Billing Address
              </FieldLabel>
              <FieldDescription>
                The official address used for billing and tax purposes.
              </FieldDescription>
              <Textarea
                {...field}
                id='create-client-form-number'
                aria-invalid={fieldState.invalid}
                placeholder='Some random place, place, random'
                className='resize-none'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type='submit' disabled={isSubmitting} className='w-fit ml-auto'>
          {isSubmitting && <Spinner />}
          Add Client
        </Button>
      </FieldGroup>
    </form>
  );
}
