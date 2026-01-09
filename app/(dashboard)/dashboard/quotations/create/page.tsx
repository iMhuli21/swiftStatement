export const runtime = 'nodejs';

import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Headertitle from '@/components/header-title';
import { getTemplateInfo } from '@/lib/db/functions';
import CreateQuotation from '@/components/quotations/create-quotation';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === true) {
    return redirect('/noaccess');
  }

  const data = getTemplateInfo(session.user.id);

  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Create Quotation' />
        <p className='text-xs opacity-50'>
          Add another quotation to your system.
        </p>
      </div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center text-center font-medium'>
            <Spinner />
            Loading....
          </div>
        }
      >
        <CreateQuotation data={data} />
      </Suspense>
    </main>
  );
}
