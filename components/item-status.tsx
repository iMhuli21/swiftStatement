'use client';

import { useRouter } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ItemStatus({ href }: { href: string }) {
  const route = useRouter();

  return (
    <ToggleGroup
      type='single'
      variant='outline'
      defaultValue='all'
      size='sm'
      onValueChange={(val) =>
        route.push(`${href}?tab=${encodeURIComponent(val)}`)
      }
    >
      <ToggleGroupItem value='all' aria-label='Toggle all'>
        <span>All</span>
      </ToggleGroupItem>
      <ToggleGroupItem value='due' aria-label='Toggle due'>
        <span>Due</span>
      </ToggleGroupItem>
      <ToggleGroupItem value='paid' aria-label='Toggle paid'>
        <span>Paid</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
