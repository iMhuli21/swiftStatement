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
      <p className='text-xs'>{`© ${new Date().getFullYear()}. All rights reserved.`}</p>
      <div className='flex items-center gap-4'>
        <a href='http://' target='_blank' rel='noopener noreferrer'>
          <FaGithub className='flex-none size-5' />
        </a>
        <a href='http://' target='_blank' rel='noopener noreferrer'>
          <FaLinkedinIn className='flex-none size-5' />
        </a>
      </div>
    </footer>
  );
}
