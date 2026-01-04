import { auth } from '@/lib/auth';
import Headertitle from '@/components/header-title';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateClient from '@/components/clients/create-client';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect('/sign-in');
  }
  return (
    <main className='px-6 space-y-6'>
      <div className='flex flex-col items-start gap-0'>
        <Headertitle title='Create Client' />
        <p className='text-xs opacity-50'>Add another client to your system.</p>
      </div>
      <CreateClient />
    </main>
  );
}
