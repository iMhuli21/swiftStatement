export const runtime = 'nodejs';

import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { getCustomerDocuments } from '@/lib/db/functions';
import ManageCustomerDocuments from '@/components/clients/manage-customer-documents';

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    page: string | undefined;
  }>;
};
export default async function page({ searchParams, params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const [searchParam, param] = await Promise.all([searchParams, params]);

  const { page } = searchParam;
  const { id } = param;

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === true) {
    return redirect('/noaccess');
  }

  const data = getCustomerDocuments(id, session.user.id, page);

  return (
    <main className='px-6 space-y-6'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center gap-4'>
            <Spinner />
            Loading clients...
          </div>
        }
      >
        <ManageCustomerDocuments data={data} />
      </Suspense>
    </main>
  );
}
