export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Account from '@/components/account/account';
import Headertitle from '@/components/header-title';
import { getUserAccountInfo } from '@/lib/db/functions';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    return redirect('/sign-in');
  }

  const data = getUserAccountInfo(session.user.id);

  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Account' />
        <p className='text-xs opacity-50'>Manage your account.</p>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center font-medium'>
            <Spinner />
            loading...
          </div>
        }
      >
        <Account data={data} />
      </Suspense>
    </main>
  );
}
