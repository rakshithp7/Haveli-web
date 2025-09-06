'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function MenuPage() {
  return (
    <div className="container-responsive py-8 px-4">
      <h1 className="text-3xl font-semibold mb-8 text-center">Our Menu</h1>
      <p className="text-center text-muted max-w-2xl mx-auto mb-10">
        Browse our delicious menu items below. For ordering, please visit our{' '}
        <Link href="/order" className="text-[--color-brand] hover:underline">
          order page
        </Link>
        .
      </p>

      <div className="grid gap-8">
        <section className="py-4">
          <div className="bg-neutral-50 p-8 rounded-lg text-center">
            <div className="aspect-[16/9] relative mb-4">
              <Image
                src="/images/placeholder.svg"
                alt={`menu section`}
                fill
                className="object-cover rounded-md opacity-50"
              />
            </div>
            <p className="text-muted mb-4">Menu images coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}
