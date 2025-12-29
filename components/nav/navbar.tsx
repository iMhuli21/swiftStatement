import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './mobile_nav';
import { routes } from '@/lib/constants';

export default function Navbar() {
  return (
    <header className='py-2 px-4 font-inter'>
      <nav className='flex items-center justify-between gap-4'>
        <Link href='/'>
          <Image
            src={'/logo-removebg-preview.png'}
            alt='swift statement logo'
            width={130}
            height={130}
            priority
          />
        </Link>
        <div className='hidden sm:flex items-center gap-4'>
          {routes.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
