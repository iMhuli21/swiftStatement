import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ItemStatus from '@/components/item-status';
import Headertitle from '@/components/header-title';

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

  return (
    <main className='px-6 space-y-6'>
      <div className='space-y-3'>
        <div className='flex flex-col items-start gap-0'>
          <Headertitle title='Clients' />
          <p className='text-xs opacity-50'>All the clients you have added.</p>
        </div>
        <div className='flex items-center gap-4 justify-between'>
          <ItemStatus href='/dashboard/clients' />
          <Button asChild>
            <Link href='/dashboard/clients/create'>+ Add Client</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
