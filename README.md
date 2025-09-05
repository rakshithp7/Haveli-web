Haveli — Indian Restaurant (Next.js 15)

Tech
- Next.js 15 (App Router, TypeScript)
- Tailwind CSS v4 (custom theme)
- shadcn-style UI (lightweight components in `components/ui`)
- Stripe (Payments) — Elements + API routes
- zustand (persisted cart)
- zod + react-hook-form (forms)
- react-bits (subtle animations)

Getting Started
1) Install deps
   - pnpm install (or npm/yarn)
2) Set env vars (see .env.example)
3) Run dev server
   - pnpm dev

Env Vars (.env.local)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
- STRIPE_SECRET_KEY=
- NEXT_PUBLIC_CURRENCY=USD
- NEXT_PUBLIC_SITE_URL=http://localhost:3000
- SEND_CATERING_EMAIL=true|false
- SEND_CONTACT_EMAIL=true|false
- EMAIL_PROVIDER=resend|sendgrid
- EMAIL_API_KEY=...
- CATERING_DEPOSIT_ENABLED=true|false
- CATERING_DEPOSIT_CENTS=5000

Pages
- `/` Home — hero, featured items, hours/location, testimonials
- `/menu` Menu — category tabs, item cards, add-to-cart, sticky tabs, skeletons
- `/order` Order — editable cart, tip selector, pickup time, notes, contact, Stripe Elements checkout
- `/order/confirm` Confirmation — shows order number
- `/catering` Catering — packages, add-ons, request form, optional Stripe deposit
- `/contact` Contact — address, map, tap-to-call, inquiry form

Stripe
- API route: `POST /api/create-payment-intent` validates items from static data and creates a PaymentIntent.
- Configure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.

Email (optional)
- API routes `POST /api/catering-request` and `POST /api/contact` are wired to optionally send email. Add a provider and key to enable.

Data
- Static, in `data/`. Update prices and flags here.

Notes
- No user accounts or database. Cart is client-side, persisted via localStorage.
- Tailwind v4 theme tokens live in `app/globals.css` and `tailwind.config.ts`.

