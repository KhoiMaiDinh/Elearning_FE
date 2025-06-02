import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex flex-row rounded-md border focus-within:ring-1 focus-within::ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-sm border-input ring-lightSilver">
        <input
          type={type}
          className={cn(
            'flex h-9 w-full  bg-transparent px-3 py-1 text-base  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none md:text-sm ',
            className
          )}
          ref={ref}
          {...props}
        />
        {props.maxLength && typeof props.value === 'string' && (
          <div className="pr-1 pb-[2px] text-xs text-muted-foreground flex items-end ">
            {props.value.length || 0}/{props.maxLength}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
