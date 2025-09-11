import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    if (!env.stripe.sk) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const stripe = new Stripe(env.stripe.sk);
    const { sessionId, orderId } = await req.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: 'Missing session ID or order ID' }, { status: 400 });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session belongs to this order
    if (!session.metadata || session.metadata.orderId !== orderId) {
      return NextResponse.json({ error: 'Invalid order verification' }, { status: 400 });
    }

    // Check payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Return order details
    return NextResponse.json({
      orderId: session.metadata.orderId,
      customerName: session.metadata.customerName,
      total: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      paymentIntentId: session.payment_intent,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
