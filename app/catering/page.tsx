'use client';
import { cateringPackages, addOns } from '@/data/catering';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  date: z.string().min(4),
  time: z.string().min(1),
  headcount: z.coerce.number().min(10),
  venue: z.string().min(2),
  notes: z.string().max(500).optional(),
});

export default function CateringPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await fetch('/api/catering-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success('Request received! We will contact you shortly.');
      form.reset();
    } else {
      toast.error('Failed to send request. Please try again.');
    }
  }

  return (
    <div className="container-responsive py-6 mx-8">
      <h1 className="mb-4 text-xl font-semibold">Catering</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cateringPackages.map((p) => (
              <Card key={p.id} className="border border-black/20 rounded-md ">
                <CardHeader>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-medium">{p.name}</h3>
                    <span className="text-brand font-semibold">{formatCurrency(p.pricePerPersonCents)} pp</span>
                  </div>
                  <p className="text-sm text-muted">Min {p.minGuests} guests</p>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm text-muted">
                    {p.inclusions.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <h3 className="font-medium">Add-ons</h3>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {addOns.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center justify-between rounded-md border border-black/10 bg-white p-3 text-sm">
                    <span>{a.name}</span>
                    <span className="text-muted">{formatCurrency(a.priceCents)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <h3 className="font-medium">Request Catering</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <Input {...form.register('name')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <Input type="email" {...form.register('email')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <Input {...form.register('phone')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Event Date</label>
                  <Input type="date" {...form.register('date')} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Time</label>
                  <Input type="time" {...form.register('time')} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Headcount</label>
                <Input type="number" min={10} {...form.register('headcount', { valueAsNumber: true })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Venue</label>
                <Input {...form.register('venue')} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Notes</label>
                <Textarea {...form.register('notes')} />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                  Submit Request
                </Button>
                {env.catering.depositEnabled && (
                  <form action="/api/catering-deposit" method="POST">
                    <Button type="submit" variant="outline">
                      Pay Deposit ({formatCurrency(env.catering.depositAmountCents)})
                    </Button>
                  </form>
                )}
              </div>
              {!env.catering.depositEnabled && <p className="text-xs text-muted">Optional deposit is disabled.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
