import { clsx, type ClassValue } from 'clsx';
import { parseISO } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDate = (value: string | Date) =>
  typeof value === 'string' ? parseISO(value) : value;

export function currencyFormatter(value: string | undefined) {
  if (value) {
    return new Intl.NumberFormat('en-ZA', {
      currency: 'ZAR',
      currencyDisplay: 'symbol',
      style: 'currency',
    }).format(parseFloat(value));
  }
}

export async function toBase64(url: string) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
