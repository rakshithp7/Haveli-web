import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Haveli | Indian Restaurant',
  description: 'Authentic Indian cuisine. Order pickup, explore our menu, and catering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lexendDeca.variable}>
      <body className="font-lexend">
        <Navbar />
        <main className="min-h-[70vh] mt-24 ">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
