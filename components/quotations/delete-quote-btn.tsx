'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deleteQuoteFn } from '@/actions/deleteQuote';

export default function DeleteQuoteBtn({ id }: { id: string }) {
  const route = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteQuoteFn(id);

    if (res?.error) {
      setLoading(false);
      return toast.error('Error', {
        description: res.error,
      });
    } else if (res?.success) {
      toast.success('Success', {
        description: res.success,
      });
      setLoading(false);

      return route.refresh();
    }
  };
  return (
    <Button
      disabled={loading}
      variant={'ghost'}
      className='items-start justify-start w-full pl-0 px-2 py-1.5 text-sm font-normal'
      onClick={handleDelete}
    >
      Delete Quote
    </Button>
  );
}
