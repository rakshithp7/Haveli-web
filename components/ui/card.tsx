import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("card", className)}>{children}</div>;
}

export function CardHeader({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4 sm:p-5 border-b border-black/5", className)}>{children}</div>;
}

export function CardContent({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4 sm:p-5", className)}>{children}</div>;
}

export function CardFooter({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4 sm:p-5 border-t border-black/5", className)}>{children}</div>;
}

