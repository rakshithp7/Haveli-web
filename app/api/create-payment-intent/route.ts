import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getItemById } from "@/data/menu";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    if (!env.stripe.sk) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
    }
    const stripe = new Stripe(env.stripe.sk, { apiVersion: "2024-06-20" });
    const body = await req.json();
    const lines: { id: string; qty: number }[] = body.lines || [];
    const tipPercent: number = Number(body.tipPercent || 0);
    const subtotal = lines.reduce((sum, l) => {
      const item = getItemById(l.id);
      if (!item) return sum;
      return sum + item.priceCents * l.qty;
    }, 0);
    const tip = Math.round((subtotal * tipPercent) / 100);
    const amount = subtotal + tip;
    if (amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const orderId = `H${Date.now().toString(36).toUpperCase()}`;
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: env.stripe.currency.toLowerCase(),
      description: `Haveli order ${orderId}`,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true },
    });
    return NextResponse.json({ clientSecret: intent.client_secret, orderId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

