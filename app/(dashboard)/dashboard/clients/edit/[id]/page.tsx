export const runtime = 'nodejs';

import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import EditClient from '@/components/clients/edit-client';
import { getClient } from '@/lib/db/functions';
import Headertitle from '@/components/header-title';
import { Spinner } from '@/components/ui/spinner';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function page({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    redirect('/sign-in');
  }

  const { id } = await params;

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === true) {
    return redirect('/noaccess');
  }

  const data = getClient(id, session.user.id);
  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Edit Client' />
        <p className='text-xs opacity-50'>Update the client on your system.</p>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center'>
            <Spinner />
            Loading...
          </div>
        }
      >
        <EditClient data={data} clientId={id} />
      </Suspense>
    </main>
  );
}
