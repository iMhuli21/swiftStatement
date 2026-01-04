import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import { extractRouterConfig } from 'uploadthing/server';
import { ourFileRouter } from '@/app/api/uploadthing/core';
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin';

const switzer = localFont({
  src: [
    {
      path: '../public/Switzer-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Switzer-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/Switzer-Semibold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/Switzer-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Switzer-Extrabold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
});

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
    <html lang='en' className={switzer.className}>
      <body className={`antialiased max-w-400 w-full mx-auto`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
