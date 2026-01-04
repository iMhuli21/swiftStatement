'use client';

export default function CurrentTime() {
  const currentDate = new Date();
  return (
    <p className='text-xs'>{`© ${currentDate.getFullYear()}. All rights reserved.`}</p>
  );
}
