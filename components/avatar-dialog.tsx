'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import React from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { avatars } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { updateAvatarFn } from '@/actions/updateAvatar';

interface Props {
  children: React.ReactNode;
}

export default function AvatarDialog({ children }: Props) {
  const route = useRouter();

  const handleAvatarUpload = async (imageUrl: string) => {
    const res = await updateAvatarFn(imageUrl);

    if (res?.error) {
      return toast.error('Error', {
        description: res.error,
      });
    } else if (res?.success) {
      toast.success('Success', {
        description: res.success,
      });

      route.refresh();
    }
  };
  return (
    <Dialog>
      <DialogTrigger className='hover:cursor-pointer'>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change avatar.</DialogTitle>
          <DialogDescription>
            Select the avatar you want as your profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center gap-4 flex-wrap py-2'>
          {avatars.map((img) => (
            <Image
              className='flex-none w-32.5 h-32.5 rounded-full border-2 object-cover object-center hover:cursor-pointer'
              key={img}
              src={img}
              alt='avatar'
              width={130}
              height={130}
              priority
              onClick={() => handleAvatarUpload(img)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
