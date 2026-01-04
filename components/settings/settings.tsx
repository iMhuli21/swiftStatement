'use client';

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field';
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from 'uploadthing/client';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDropzone } from '@uploadthing/react';
import { Spinner } from '@/components/ui/spinner';
import { useUploadThing } from '@/lib/uploadthing';
import { use, useCallback, useState } from 'react';
import { updateUserFn } from '@/actions/updateUser';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserInfoSchema, EditUserInfoType } from '@/lib/schemas';

type Props = {
  data: Promise<
    | {
        id: string;
        name: string;
        email: string;
        image: string | null;
        companyAccountNumber: number | null;
        companyAccountType: string | null;
        companyBranchCode: number | null;
        companyName: string | null;
        companyBank: string | null;
        contactNumber: string | null;
        logoUrl: string | null;
        avatarUrl: string | null;
        template: string | null;
        createdAt: Date;
        updatedAt: Date;
      }
    | undefined
  >;
};

export default function Settings({ data }: Props) {
  const result = use(data);
  const route = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const form = useForm<EditUserInfoType>({
    resolver: zodResolver(editUserInfoSchema),
    mode: 'onChange',
    defaultValues: {
      companyAccNo: result?.companyAccountNumber
        ? result.companyAccountNumber.toString()
        : '',
      companyAccType: result?.companyAccountType
        ? result.companyAccountType
        : '',
      companyBank: result?.companyBank ? result.companyBank : '',
      companyBranchCode: result?.companyBranchCode
        ? result.companyBranchCode.toString()
        : '',
      companyName: result?.companyName ? result.companyName : '',
      contactNumber: result?.contactNumber ? result.contactNumber : '',
      emailAddress: result?.email ? result.email : '',
      name: result?.name ? result.name : '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const { startUpload, routeConfig, isUploading } = useUploadThing(
    'logoUploader',
    {
      onClientUploadComplete: (res) => {
        toast.success('Success', {
          description: 'Uploaded successfully!',
        });

        setFiles([]);

        setLogoUrl(res[0].ufsUrl);
      },
      onUploadError: () => {
        toast.error('Error', {
          description: 'Error occurred while uploading',
        });
      },
      onUploadBegin: () => {
        toast.info('Message', {
          description: 'Upload has begun',
        });
      },
    }
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  const onSubmit = async (values: EditUserInfoType) => {
    const result = await updateUserFn(values, logoUrl);

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
      <div>
        <form
          id='update-user-form'
          onSubmit={handleSubmit(onSubmit)}
          className='max-w-200 w-full'
        >
          <FieldGroup>
            <Controller
              name='contactNumber'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-contact-number'>
                    Contact Number
                  </FieldLabel>
                  <FieldDescription>
                    A phone number clients can use to reach your business.
                  </FieldDescription>
                  <Input
                    id='update-user-form-contact-number'
                    {...field}
                    placeholder='+27123456789'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='emailAddress'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-email'>
                    Email
                  </FieldLabel>
                  <FieldDescription>
                    The main email address used for communication and
                    notifications.
                  </FieldDescription>
                  <Input
                    type='email'
                    id='update-user-form-email'
                    {...field}
                    placeholder='johndoe@gmail.com'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='name'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-name'>Name</FieldLabel>
                  <FieldDescription>
                    The full name as it should appear on invoices and
                    quotations.
                  </FieldDescription>
                  <Input
                    id='update-user-form-name'
                    {...field}
                    placeholder='John Doe'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name='companyName'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-company-name'>
                    Company Name
                  </FieldLabel>
                  <FieldDescription>
                    The business name that will appear on invoices and
                    documents.
                  </FieldDescription>
                  <Input
                    id='update-user-form-company-name'
                    {...field}
                    placeholder='Acme Corp'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='companyBank'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-company-bank'>
                    Company Bank
                  </FieldLabel>
                  <FieldDescription>
                    The bank where the company account is held.
                  </FieldDescription>
                  <Input
                    id='update-user-form-company-bank'
                    {...field}
                    placeholder='First National Bank'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='companyAccNo'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-company-acc-no'>
                    Company Account Number
                  </FieldLabel>
                  <FieldDescription>
                    The bank account numebr used for receiving payments.
                  </FieldDescription>
                  <Input
                    id='update-user-form-company-acc-no'
                    {...field}
                    placeholder='1234567890'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='companyAccType'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-company-acc-type'>
                    Company Account Type
                  </FieldLabel>
                  <FieldDescription>
                    The type of bank account used for receiving payments (for
                    example, Savings or Cheque).
                  </FieldDescription>
                  <Input
                    id='update-user-form-company-acc-type'
                    {...field}
                    placeholder='Cheque'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name='companyBranchCode'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='update-user-form-company-branch-code'>
                    Company Bank Branch Code
                  </FieldLabel>
                  <FieldDescription>
                    The branch or routing code required for bank transfers.
                  </FieldDescription>
                  <Input
                    id='update-user-form-company-bank'
                    {...field}
                    placeholder='250655'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className='w-full'>
              <Label className='mb-4'>Upload Logo</Label>
              <div className='flex items-center gap-4'>
                <div
                  className='w-full border-2 border-dashed p-4 h-37.5 rounded-md flex items-center justify-center opacity-60 border-gray-400'
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {files.length === 0 ? (
                    <span className='uppercase font-medium text-sm'>
                      Drop logo here.
                    </span>
                  ) : (
                    <span>File selected.</span>
                  )}
                </div>
                {logoUrl && (
                  <div className='relative'>
                    <Image
                      src={logoUrl}
                      alt='logo url'
                      width={400}
                      height={400}
                      className='w-37.5 h-37.5 rounded-md object-cover object-center '
                    />
                    <div className='absolute bg-accent rounded-full size-8 flex items-center justify-center -top-3 -right-2 border font-medium border-black/80'>
                      x
                    </div>
                  </div>
                )}
              </div>
              {files.length > 0 && (
                <span className='text-sm mb-2'>
                  Note: Please note that to make any changes you have save the
                  changes you make.
                </span>
              )}
              {files.length > 0 && (
                <div className='flex items-center gap-2 mt-2'>
                  <Button
                    type='button'
                    className='flex items-center gap-2 bg-green-400 hover:bg-green-400/80'
                    disabled={isUploading}
                    onClick={() => startUpload(files)}
                  >
                    {isUploading && <Spinner />}
                    Upload File
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isUploading}
                    onClick={() => setFiles([])}
                  >
                    Cancel Upload
                  </Button>
                </div>
              )}
            </div>
            <Button
              type='submit'
              className='w-fit ml-auto'
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />} Save Changes
            </Button>
          </FieldGroup>
        </form>
      </div>
    );
}
