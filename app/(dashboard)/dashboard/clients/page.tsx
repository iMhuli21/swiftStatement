export const runtime = 'nodejs';

import Link from 'next/link';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getClients } from '@/lib/db/functions';
import ItemStatus from '@/components/item-status';
import { Spinner } from '@/components/ui/spinner';
import Headertitle from '@/components/header-title';
import ManageClients from '@/components/clients/manage-clients';

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

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === true) {
    return redirect('/noaccess');
  }

  const data = getClients(session.user.id, tab);

  return (
    <main className='px-6 space-y-6'>
      <div className='space-y-3'>
        <div className='flex flex-col items-start gap-0'>
          <Headertitle title='Clients' />
          <p className='text-xs opacity-50'>All the clients you have added.</p>
        </div>
        <div className='flex items-center gap-4 justify-end'>
          <Button asChild>
            <Link href='/dashboard/clients/create'>+ Add Client</Link>
          </Button>
        </div>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center gap-4'>
            <Spinner />
            Loading clients...
          </div>
        }
      >
        <ManageClients data={data} />
      </Suspense>
    </main>
  );
}
