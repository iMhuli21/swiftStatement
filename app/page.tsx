import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { steps, features } from '@/lib/constants';
import Link from 'next/link';

export default function Page() {
  return (
    <main className='space-y-10 py-7'>
      {/* HERO */}
      <section className='min-h-[80dvh] flex flex-col-reverse items-start lg:flex-row lg:items-center gap-7 lg:justify-between px-4'>
        <div className='flex flex-col items-start gap-2'>
          <h1 className='font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight'>
            Make Invoices Swift
          </h1>
          <p className='max-w-138 w-full'>
            Create, send and track invoices in just a few clicks. Save time, get
            paid faster and keep your business running smoothly.
          </p>
          <div className='flex items-center gap-4'>
            <Button asChild>
              <Link href='/sign-up'>Sign Up Free</Link>
            </Button>
            <Button variant='secondary' className='button_pulse'>
              <Link href='/login'>Try It Now</Link>
            </Button>
          </div>
        </div>
        <Image
          src='/working_on_laptop.png'
          alt='an illustration of a person working on a laptop'
          width={500}
          height={500}
          priority
          className='object-cover size-100 lg:size-125'
        />
      </section>
      {/* HOW IT WORKS */}
      <section className='space-y-4 bg-gray-100 px-4 py-10'>
        <Header
          title='How It Works'
          subtitle='Get started in three simple steps.'
        />
        <div className='w-full px-4 py-6'>
          <div className='relative max-w-370 mx-auto'>
            {/* Horizontal line (desktop only) */}
            <div className='hidden sm:block absolute top-2 left-0 w-full h-px bg-gray-300' />

            <div className='flex flex-col sm:flex-row sm:justify-between gap-10 sm:gap-0'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className='relative flex sm:flex-col items-start sm:items-center text-left sm:text-center sm:w-1/3'
                >
                  {/* Vertical line (mobile only) */}
                  {index !== steps.length - 1 && (
                    <div className='sm:hidden absolute left-2 top-5 w-px h-full bg-gray-300' />
                  )}

                  {/* Dot */}
                  <div className='relative z-10 w-4 h-4 bg-primary rounded-full ring-1 ring-offset-4 ring-gray-300' />

                  {/* Text */}
                  <div className='ml-4 sm:ml-0 sm:mt-4 max-w-xs'>
                    <span className='text-sm'>{step.title}</span>
                    <h4 className='text-base font-medium capitalize'>
                      {step.subtitle}
                    </h4>
                    <p className='mt-1 text-sm opacity-50'>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* FEATURES */}
      <section className='space-y-4 px-4'>
        <Header title='Features' subtitle='Powerful features made simple.' />
        <div className='flex items-center flex-wrap gap-6'>
          {features.map((feature) => (
            <Card
              key={feature.title}
              className='w-full max-w-sm hover:scale-105 hover:transition-transform hover:duration-150 hover:ease-in-out'
            >
              <CardContent className='flex flex-col items-center gap-2'>
                <feature.icon />
                <h4 className='font-medium text-base capitalize'>
                  {feature.title}
                </h4>
                <p className='text-center text-sm opacity-50'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
