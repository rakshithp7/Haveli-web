import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';

export async function POST() {
  try {
    if (!env.catering.depositEnabled) return NextResponse.json({ error: 'Deposit disabled' }, { status: 400 });
    if (!env.stripe.sk) return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 });
    const stripe = new Stripe(env.stripe.sk, { apiVersion: '2025-08-27.basil' });
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/order/confirm?orderId=CATERING-${Date.now()}`
        : 'http://localhost:3000/order/confirm',
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/catering`
        : 'http://localhost:3000/catering',
      line_items: [
        {
          price_data: {
            currency: env.stripe.currency.toLowerCase(),
            product_data: { name: 'Catering Deposit' },
            unit_amount: env.catering.depositAmountCents,
          },
          quantity: 1,
        },
      ],
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
