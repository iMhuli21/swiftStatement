import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import ItemStatus from '@/components/item-status';
import { getQuotations } from '@/lib/db/functions';
import Headertitle from '@/components/header-title';
import ManageQuotations from '@/components/quotations/manage-quotations';

type Props = {
  searchParams: Promise<{
    tab: string | undefined;
  }>;
};

export default async function page({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { tab } = await searchParams;

  const data = getQuotations(session.user.id, tab);

  return (
    <main className='px-6 space-y-6'>
      <div className='space-y-3'>
        <div className='flex flex-col items-start gap-0'>
          <Headertitle title='Quotations' />
          <p className='text-xs opacity-50'>
            All the quotations you have created.
          </p>
        </div>
        <div className='flex items-center gap-4 justify-between'>
          <ItemStatus href='/dashboard/quotations' />
          <Button asChild>
            <Link href='/dashboard/quotations/create'>+ Add Quotation</Link>
          </Button>
        </div>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center juc'>
            <Spinner /> loading...
          </div>
        }
      >
        <ManageQuotations data={data} />
      </Suspense>
    </main>
  );
}
