'use client';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { signUpSchema, SignUpType } from '@/lib/schemas';

import { createUserFn } from '@/actions/createUser';
import { useRouter } from 'next/navigation';
import { Spinner } from '../ui/spinner';

export default function SignUpForm() {
  const route = useRouter();
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: SignUpType) => {
    const res = await createUserFn(values);

    if (res?.error) {
      return toast.error('Error', {
        description: res.error,
      });
    } else if (res?.success) {
      toast.success('Success', {
        description: res.success,
      });

      route.push('/dashboard');
      route.refresh();
    }
  };

  return (
    <div className='flex flex-col gap-6'>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <form
            id='sign_up_form'
            className='p-6 md:p-8'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <div className='flex flex-col items-center gap-1 text-center'>
                <h1 className='text-2xl font-bold tracking-tight'>Welcome</h1>
                <p className='text-muted-foreground text-balance'>
                  Create your Swift Statement account
                </p>
              </div>
              <FieldGroup>
                <Controller
                  name='name'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='sign_up_form_name'>Name</FieldLabel>
                      <Input
                        {...field}
                        id='sign_up_form_name'
                        aria-invalid={fieldState.invalid}
                        placeholder='e.g. EngineWorks'
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
                      <FieldLabel htmlFor='sign_up_form_email'>
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        type='email'
                        id='sign_up_form_email'
                        aria-invalid={fieldState.invalid}
                        placeholder='e.g. johndoe@gmail.com'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='sign_up_form_password'>
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        type='password'
                        id='sign_up_form_password'
                        aria-invalid={fieldState.invalid}
                        placeholder='**************'
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Field>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting && <Spinner />} Sign Up
                </Button>
              </Field>

              <FieldDescription className='text-center'>
                Already have an account? <Link href='/sign-in'>Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className='bg-muted relative hidden md:block'>
            <Image
              src='/banner_laptop.jpg'
              width={400}
              height={400}
              alt='form image of someone working on their laptop.'
              className='absolute inset-0 h-full w-full object-cover object-center brightness-75'
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
