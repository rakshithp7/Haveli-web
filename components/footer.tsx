import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-black/10 bg-[#f8f8f8] px-8">
      <div className="container-responsive py-12 text-sm">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: About */}
          <div>
            <div className="mb-4">
              <Link href="/">
                <Image src="/logo.webp" alt="Haveli" width={120} height={36} className="h-12 w-auto" />
              </Link>
            </div>
            <p className="mb-4 text-muted-foreground">
              Authentic Indian cuisine serving the finest traditional dishes in a warm and inviting atmosphere.
            </p>
            <p className="text-muted-foreground">© {new Date().getFullYear()} Haveli. All rights reserved.</p>
          </div>

          {/* Column 2: Contact Info */}
          <div>
            <h3 className="mb-4 font-bold text-foreground">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p className="mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-[--color-brand]" />
                12908 N Dale Mabry Hwy
              </p>
              <p className="mb-2 ml-6">Tampa, FL 33618</p>
              <p className="mb-2 flex items-center gap-2">
                <Phone size={16} className="text-[--color-brand]" />
                (813) 488-6294
              </p>
            </address>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="mb-4 font-bold text-foreground">Hours</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Monday: 11:30am–3pm, 5pm–10pm</li>
              <li className="text-red-500">Tuesday: Closed</li>
              <li>Wednesday: 11:30am–3pm, 5pm–10pm</li>
              <li>Thursday: 11:30am–3pm, 5pm–10pm</li>
              <li>Friday: 11:30am–3pm, 5pm–11pm</li>
              <li>Saturday: 11:30am–3pm, 5pm–11pm</li>
              <li>Sunday: 11:30am–3pm, 5pm–10pm</li>
            </ul>
          </div>
        </div>
        {/* Social Media Links */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="https://instagram.com"
            className="group flex items-center gap-1.5 text-muted-foreground hover:text-[#E1306C]">
            <Instagram size={16} className="transition-colors duration-200 group-hover:text-[#E1306C]" />
            Instagram
          </Link>
          <Link
            href="https://facebook.com"
            className="group flex items-center gap-1.5 text-muted-foreground hover:text-[#1877F2]">
            <Facebook size={16} className="transition-colors duration-200 group-hover:text-[#1877F2]" />
            Facebook
          </Link>
        </div>
      </div>
    </footer>
  );
}
