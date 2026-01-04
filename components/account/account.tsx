'use client';

import { use } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AvatarDialog from '../avatar-dialog';
import Image from 'next/image';
import { format } from 'date-fns';
import { toDate } from '@/lib/utils';
import { Pen } from 'lucide-react';
import Link from 'next/link';

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

export default function Account({ data }: Props) {
  const result = use(data);

  if (result)
    return (
      <div>
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3'>
          <Card className='@container/card'>
            <CardContent className='flex flex-col items-center justify-center gap-4'>
              <AvatarDialog>
                <Image
                  src={!result.image ? '/avatar.png' : result.image}
                  alt='avatar'
                  width={150}
                  height={150}
                  className='w-37.5 h-37.5 object-cover object-center rounded-full ring-2 ring-offset-2 ring-gray-200'
                  priority
                />
              </AvatarDialog>
              <div className='flex flex-col items-center justify-center gap-2'>
                <h3 className='text-lg font-semibold tracking-tight'>
                  {result?.name}
                </h3>
                <p>{result?.contactNumber}</p>
                <p>{result?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='@container/card'>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardAction>
                <Link href='/dashboard/settings'>
                  <div className='p-2 rounded-full size-8 flex items-center justify-center bg-sky-50'>
                    <Pen className='size-5' />
                  </div>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Date Joined:</span>
                <p className='text-sm font-medium'>
                  {format(toDate(result.createdAt), 'dd MMM yyyy')}
                </p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Invoices:</span>
                <p className='text-sm font-medium'>{'10'}</p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Quotations:</span>
                <p className='text-sm font-medium'>{'20'}</p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Template:</span>
                <p className='text-sm font-medium'>{result.template}</p>
              </div>
            </CardContent>
          </Card>
          <Card className='@container/card'>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardAction>
                <Link href='/dashboard/settings'>
                  <div className='p-2 rounded-full size-8 flex items-center justify-center bg-sky-50'>
                    <Pen className='size-5' />
                  </div>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Company Name:</span>
                <p className='text-sm font-medium'>{result.companyName}</p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Company Bank:</span>
                <p className='text-sm font-medium'>{result.companyBank}</p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Company Bank Branch Code:</span>
                <p className='text-sm font-medium'>
                  {result.companyBranchCode}
                </p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Company Account Number:</span>
                <p className='text-sm font-medium'>
                  {result.companyAccountNumber}
                </p>
              </div>
              <div className='flex items-center gap-1 text-sm'>
                <span className='text-sm'>Company Account Type:</span>
                <p className='text-sm font-medium'>
                  {result.companyAccountType}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
}
