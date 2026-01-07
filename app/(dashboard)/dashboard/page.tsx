export const runtime = 'nodejs';

import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Headertitle from '@/components/header-title';
import { getDashboardInfo } from '@/lib/db/functions';
import { SectionCards } from '@/components/dashboard/section-cards';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    redirect('/sign-in');
  }

  const data = getDashboardInfo(session.user.id);
  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Dashboard' />
        <p className='text-xs opacity-50'>Overview of your system.</p>
      </div>
      <Suspense>
        <SectionCards data={data} />
      </Suspense>
    </main>
  );
}
