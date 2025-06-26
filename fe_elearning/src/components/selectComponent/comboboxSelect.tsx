'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import Image from 'next/image';

type ComboboxOption = {
  id: string;
  value: string;
  image?: string;
};

type ComboboxProps = {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  data: ComboboxOption[];
  error?: string;
  className?: string;
  value?: string;
};

const ComboboxRegister: React.FC<ComboboxProps> = ({
  label,
  placeholder,
  disabled,
  onValueChange,
  data,
  error,
  className,
  value,
}) => {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = data.find((item) => item.id === value)?.value;

  return (
    <div className={cn('w-full max-w-md flex flex-col gap-1.5', className)}>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn('justify-between text-left w-full', !value && 'text-muted-foreground')}
          >
            {selectedLabel || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] max-h-60 overflow-auto p-0 z-50"
          side="bottom"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Tìm kiếm..." />
            <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
            <CommandGroup>
              {data &&
                data.length > 0 &&
                data.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.value}
                    onSelect={() => {
                      onValueChange?.(item.id);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Check
                      className={cn(
                        'h-4 w-4 text-primary',
                        item.id === value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.value}
                        className="w-auto md:h-5 h-2 object-contain"
                      />
                    )}
                    {item.value}
                  </CommandItem>
                ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <div className="text-[12px] font-normal text-redPigment">{error}</div>}
    </div>
  );
};

export default ComboboxRegister;
