'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('w-full', className)}>{children}</div>;
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'sticky top-0 z-20 bg-[--color-bg]/80 backdrop-blur supports-[backdrop-filter]:bg-[--color-bg]/60 border-b border-black/10',
        className
      )}>
      <div className="container-responsive flex gap-2 overflow-x-auto py-2">{children}</div>
    </div>
  );
}

export function TabsTrigger({
  value,
  active,
  onClick,
  children,
  className,
}: {
  value: string;
  active: boolean;
  onClick: (v: string) => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        'whitespace-nowrap rounded-full border px-3 py-1 text-sm flex items-center',
        active
          ? 'border-[--color-brand] bg-[--color-brand]/10 text-[--color-brand]'
          : 'border-black/10 bg-white hover:bg-black/5',
        className
      )}>
      {children || value}
    </button>
  );
}
