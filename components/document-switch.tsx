'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function DocumentSwitch() {
  const route = useRouter();
  const params = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className='mx-auto'>
      <ToggleGroup
        type='single'
        variant='outline'
        defaultValue={
          searchParams.get('tab')
            ? (searchParams.get('tab') as string)
            : 'invoices'
        }
        onValueChange={(val) =>
          route.push(`${params}?tab=${encodeURIComponent(val)}`)
        }
      >
        <ToggleGroupItem value={'invoices'} aria-label='Toggle invoices'>
          <span>Invoices</span>
        </ToggleGroupItem>
        <ToggleGroupItem value={'quotations'} aria-label='Toggle quotations'>
          <span>Quotations</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
