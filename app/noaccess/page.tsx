import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.id) {
    return redirect('/sign-in');
  }

  const hasAccess = await db.query.user.findFirst({
    where: (user, { eq }) => eq(user.id, session.user.id),
    columns: {
      revokeAccess: true,
    },
  });

  if (hasAccess?.revokeAccess === false) {
    return redirect('/dashboard');
  }
  return (
    <div className='min-h-dvh flex items-center justify-center'>
      You currently have no access to this system without the approval.
    </div>
  );
}
