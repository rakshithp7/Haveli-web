'use client';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return <SonnerToaster offset={{ top: 100 }} mobileOffset={{ top: 90 }} position="top-right" richColors />;
}
