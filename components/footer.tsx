import { Suspense } from 'react';
import CurrentTime from './current-time';
import { Bebas_Neue } from 'next/font/google';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400',
});

export default function Footer() {
  return (
    <footer className='bg-black py-5 px-4 text-white flex flex-col items-start gap-4 sm:items-center sm:flex-row sm:justify-between'>
      <p className={`${bebas.className}`}>huliTheDev</p>
      <Suspense fallback={<p>loading...</p>}>
        <CurrentTime />
      </Suspense>
      <div className='flex items-center gap-4'>
        <a
          href='https://github.com/iMhuli21'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaGithub className='flex-none size-5' />
        </a>
        <a
          href='https://www.linkedin.com/in/hulisani-sadiki-1438b5270/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <FaLinkedinIn className='flex-none size-5' />
        </a>
      </div>
    </footer>
  );
}
