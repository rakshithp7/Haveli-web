import * as React from 'react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm outline-none transition focus:border-brand',
        className
      )}
      {...props}>
      {children}
    </select>
  );
}
