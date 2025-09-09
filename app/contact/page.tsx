'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  topic: z.enum(['General', 'Order', 'Catering', 'Feedback']).default('General'),
  message: z.string().min(5),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { topic: 'General' } });

  async function onSubmit(values: z.infer<typeof schema>) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      toast.success("Message sent! We'll reply soon.");
      form.reset();
    } else {
      toast.error('Failed to send. Try again later.');
    }
  }

  return (
    <div className="container-responsive grid gap-6 py-6 mx-8 sm:grid-cols-2">
      <div>
        <h1 className="mb-3 text-xl font-semibold">Contact Us</h1>
        <p className="text-sm text-muted">12908 N Dale Mabry Hwy, Tampa, FL 33618</p>
        <div className="mt-3 flex gap-3 text-sm">
          <Link href="tel:+15551234567" className="text-[--color-brand]">
            Call (813) 488-6294
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-md">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.702614129809!2d-82.5053142!3d28.0641035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c15ee95eab43%3A0xdd5a43168c132d9b!2sHaveli%20Indian%20Kitchen!5e0!3m2!1sen!2sus!4v1757308140368!5m2!1sen!2sus"
            width="100%"
            height="320"
            loading="lazy"
          />
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold">Send a Message</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input {...form.register('name')} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" {...form.register('email')} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input {...form.register('phone')} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Topic</label>
            <Select value={form.watch('topic')} onChange={(e) => form.setValue('topic', e.target.value as any)}>
              {(['General', 'Order', 'Catering', 'Feedback'] as const).map((t) => (
                <option value={t} key={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Message</label>
            <Textarea rows={5} {...form.register('message')} />
          </div>
          <Button onClick={form.handleSubmit(onSubmit)}>Send</Button>
        </div>
      </div>
    </div>
  );
}
