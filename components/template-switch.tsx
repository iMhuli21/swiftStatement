'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { templates } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { switchTemplateFn } from '@/actions/updateTemplate';

export default function TemplateSwitch({
  userId,
  template,
}: {
  userId: string;
  template: string | null | undefined;
}) {
  const route = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(template);
  const [loading, setLoading] = useState(false);

  const switchTemplate = async (template: string) => {
    setLoading(true);
    const result = await switchTemplateFn(template);

    if (result?.error) {
      setLoading(false);
      return toast.error('Error', {
        description: result.error,
      });
    } else if (result?.success) {
      setLoading(false);

      route.refresh();
      return toast.success('Success', {
        description: result.success,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={loading} suppressHydrationWarning>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-50 justify-between'
        >
          {value
            ? templates.find((template) => template.value === value)?.label
            : 'Select template...'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-50 p-0'>
        <Command>
          <CommandInput placeholder='Search framework...' className='h-9' />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {templates.map((template) => (
                <CommandItem
                  key={template.value}
                  value={template.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    switchTemplate(currentValue);
                  }}
                >
                  {template.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === template.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
