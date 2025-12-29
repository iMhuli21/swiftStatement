'use client';

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { routes } from '@/lib/constants';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';

export default function MobileNav() {
  return (
    <div className='sm:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <HiOutlineMenuAlt2 className='flex-none size-8' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Navigation</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {routes.map(({ href, label }) => (
            <DropdownMenuItem key={href}>
              <Link href={href}>{label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
