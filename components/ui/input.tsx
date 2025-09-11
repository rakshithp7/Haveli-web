import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps): React.JSX.Element {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-brand',
        className
      )}
      {...props}
    />
  );
}
