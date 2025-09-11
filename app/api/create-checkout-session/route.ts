import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getItemById } from '@/data/menu';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    // Check Stripe configuration
    if (!env.stripe.sk) {
      console.error('Stripe Secret Key not configured');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    const stripe = new Stripe(env.stripe.sk);
    const body = await req.json();
    const { lines, customerInfo } = body;

    // Validate input
    if (!lines || lines.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!customerInfo?.name || !customerInfo?.phone) {
      return NextResponse.json({ error: 'Customer information required' }, { status: 400 });
    }

    // Create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    
    for (const line of lines) {
      const menuItem = getItemById(line.id);
      if (!menuItem) {
        return NextResponse.json({ error: `Menu item ${line.id} not found` }, { status: 400 });
      }

      // Build item name with customizations
      let itemName = menuItem.name;
      if (line.spiceLevel) {
        itemName += ` (${line.spiceLevel} spice)`;
      }
      if (line.specialInstructions) {
        itemName += ` - ${line.specialInstructions}`;
      }

      lineItems.push({
        price_data: {
          currency: env.stripe.currency.toLowerCase(),
          product_data: {
            name: itemName,
            description: menuItem.description,
          },
          unit_amount: menuItem.priceCents,
        },
        quantity: line.qty,
      });
    }

    // Calculate tax
    const taxRate = 0.075; // 7.5%
    const subtotal = lineItems.reduce((sum, item) => {
      return sum + ((item.price_data?.unit_amount || 0) * (item.quantity || 0));
    }, 0);
    const taxAmount = Math.round(subtotal * taxRate);

    // Add tax as a line item
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: env.stripe.currency.toLowerCase(),
          product_data: {
            name: 'Sales Tax',
            description: '7.5% sales tax',
          },
          unit_amount: taxAmount,
        },
        quantity: 1,
      });
    }

    // Generate order ID
    const orderId = `HAVELI-${Date.now().toString(36).toUpperCase()}`;

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/status?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order/cancel`,
      metadata: {
        orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
      },
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
      orderId 
    });

  } catch (error) {
    console.error('Stripe checkout session error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid API Key')) {
        return NextResponse.json({ error: 'Payment system configuration error' }, { status: 500 });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
