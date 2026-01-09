export const runtime = 'nodejs';

import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Headertitle from '@/components/header-title';
import Settings from '@/components/settings/settings';
import { getUserAccountInfo } from '@/lib/db/functions';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) redirect('/sign-in');

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === true) {
    return redirect('/noaccess');
  }

  const data = getUserAccountInfo(session.user.id);
  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Settings' />
        <p className='text-xs opacity-50'>Make changes to your system.</p>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center text-center font-medium'>
            <Spinner />
            Loading....
          </div>
        }
      >
        <Settings data={data} />
      </Suspense>
    </main>
  );
}
