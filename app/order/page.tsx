"use client";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";

const stripePromise = env.stripe.pk ? loadStripe(env.stripe.pk) : null;

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  tipPercent: z.enum(["0", "10", "15", "20"]).default("0"),
  pickup: z.enum(["ASAP", "+15", "+30"]).default("ASAP"),
  notes: z.string().max(300).optional(),
});
type Values = z.infer<typeof schema>;

export default function OrderPage() {
  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);

  const subtotal = useMemo(
    () => Object.values(lines).reduce((a, l) => a + l.priceCents * l.qty, 0),
    [lines]
  );
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { tipPercent: "0", pickup: "ASAP" } });
  const tipPercent = Number(form.watch("tipPercent"));
  const tipCents = Math.round((subtotal * tipPercent) / 100);
  const totalCents = subtotal + tipCents;

  return (
    <div className="container-responsive py-6">
      <h1 className="mb-4 text-xl font-semibold">Your Order</h1>
      {Object.keys(lines).length === 0 ? (
        <p className="text-muted">Your cart is empty. Visit the menu to add items.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="divide-y divide-black/5 rounded-md border border-black/10 bg-white">
              {Object.values(lines).map((l) => (
                <li key={l.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-3 sm:grid-cols-[1fr_auto_auto]">
                  <div>
                    <p className="font-medium">{l.name}</p>
                    <p className="text-sm text-muted">{formatCurrency(l.priceCents)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn btn-outline h-8 px-2" onClick={() => setQty(l.id, l.qty - 1)}>-</button>
                    <span className="w-6 text-center">{l.qty}</span>
                    <button className="btn btn-outline h-8 px-2" onClick={() => setQty(l.id, l.qty + 1)}>+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(l.qty * l.priceCents)}</span>
                    <button className="text-sm text-red-600" onClick={() => remove(l.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Tip</label>
                <div className="flex gap-2">
                  {["0", "10", "15", "20"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => form.setValue("tipPercent", p as any)}
                      className={
                        "btn " + (form.watch("tipPercent") === p ? "btn-primary" : "btn-outline")
                      }
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Pickup Time</label>
                <Select value={form.watch("pickup")} onChange={(e) => form.setValue("pickup", e.target.value as any)}>
                  <option value="ASAP">ASAP</option>
                  <option value="+15">+15 minutes</option>
                  <option value="+30">+30 minutes</option>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <Textarea placeholder="Any special requests?" {...form.register("notes")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <Input placeholder="Your full name" {...form.register("name")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <Input placeholder="(555) 000-0000" {...form.register("phone")} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-md border border-black/10 bg-white p-4">
              <h3 className="mb-2 font-medium">Summary</h3>
              <div className="text-sm text-muted">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span>Tip</span><span>{formatCurrency(tipCents)}</span></div>
                <div className="mt-2 border-t border-black/10 pt-2 text-[--color-fg] font-semibold flex justify-between"><span>Total</span><span>{formatCurrency(totalCents)}</span></div>
              </div>
            </div>
            {stripePromise ? (
              <Elements stripe={stripePromise} options={{ appearance: { theme: "stripe" } }}>
                <CheckoutBox totalCents={totalCents} clearCart={clear} lines={lines} formValues={form} />
              </Elements>
            ) : (
              <p className="text-sm text-muted">Stripe not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable payments.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutBox({ totalCents, clearCart, lines, formValues }: {
  totalCents: number;
  clearCart: () => void;
  lines: ReturnType<typeof useCartStore.getState>["lines"];
  formValues: ReturnType<typeof useForm<Values>>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!stripe || !elements) return;
    const values = formValues.getValues();
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: Object.values(lines).map((l) => ({ id: l.id, qty: l.qty })),
          tipPercent: Number(values.tipPercent),
          contact: { name: values.name, phone: values.phone },
          notes: values.notes,
        }),
      });
      if (!res.ok) throw new Error("Failed to create payment intent");
      const data = await res.json();
      const { clientSecret, orderId } = data;
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: window.location.origin + "/order/confirm?orderId=" + orderId },
        redirect: "if_required",
      });
      if (result.error) throw result.error;
      clearCart();
      router.push(`/order/confirm?orderId=${orderId}`);
    } catch (e) {
      console.error(e);
      alert("Payment failed. Please check details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 rounded-md border border-black/10 bg-white p-4">
      <PaymentElement />
      <Button onClick={onSubmit} disabled={submitting} className="w-full">
        {submitting ? "Processing…" : `Pay ${formatCurrency(totalCents)}`}
      </Button>
    </div>
  );
}

