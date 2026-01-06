import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getInvoice } from '@/lib/db/functions';
import { Spinner } from '@/components/ui/spinner';
import Headertitle from '@/components/header-title';
import EditInvoice from '@/components/invoices/edit-invoice';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function page({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { id } = await params;

  const data = getInvoice(id, session.user.id);

  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Edit Invoice' />
        <p className='text-xs opacity-50'>Edit invoice.</p>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center text-center font-medium'>
            <Spinner />
            Loading....
          </div>
        }
      >
        <EditInvoice data={data} invoiceId={id} />
      </Suspense>
    </main>
  );
}
