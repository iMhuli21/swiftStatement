import './globals.css';
import type { Metadata } from 'next';
import Footer from '@/components/footer';
import { Roboto_Flex } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const roboto = Roboto_Flex({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Swift Statement',
  description: 'Make statements swiftly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={roboto.variable}>
      <body className={`antialiased max-w-400 w-full mx-auto`}>
        {children}
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
