'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  numberOfPages,
  href,
}: {
  numberOfPages: number | undefined;
  href: string;
}) {
  const route = useRouter();

  const search = useSearchParams();

  const tab = search.get('tab') as string;
  const currentPage = !search.get('page') ? 1 : Number(search.get('page'));

  const paginationPages = useMemo(() => {
    if (numberOfPages) {
      const visiblePages = [];

      const visiblePaginationPages = 5;

      const startPage = Math.max(
        1,
        currentPage - Math.floor(visiblePaginationPages / 2)
      );

      const endPage = Math.min(
        numberOfPages,
        startPage + visiblePaginationPages - 1
      );

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    }
  }, [currentPage, numberOfPages]);

  const handlePrevious = () => {
    if (tab) {
      return route.push(`${href}?tab=${tab}&page=${currentPage - 1}`);
    }
    return route.push(`${href}?page=${currentPage - 1}`);
  };
  const handleNext = () => {
    if (tab) {
      return route.push(`${href}?tab=${tab}&page=${currentPage + 1}`);
    }
    return route.push(`${href}?page=${currentPage + 1}`);
  };

  const handlePagePress = (page: number) => {
    if (tab) {
      return route.push(`${href}?tab=${tab}&page=${page}`);
    }
    return route.push(`${href}?page=${page}`);
  };

  return (
    <div className='flex items-center justify-center gap-3'>
      <Button
        className='flex items-center gap-2'
        disabled={currentPage === 1}
        variant={'outline'}
        onClick={handlePrevious}
      >
        <ChevronLeft className='w-4 h-4 flex-none' />
        Previous
      </Button>
      <div className='flex items-center gap-4'>
        {paginationPages?.map((page) => (
          <Button
            key={page}
            onClick={() => handlePagePress(page)}
            variant={currentPage === page ? 'outline' : 'ghost'}
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        className='flex items-center gap-2'
        disabled={numberOfPages === currentPage || !numberOfPages}
        variant={'outline'}
        onClick={handleNext}
      >
        Next
        <ChevronRight className='w-4 h-4 flex-none' />
      </Button>
    </div>
  );
}
