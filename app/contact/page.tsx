'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  topic: z.enum(['General', 'Order', 'Catering', 'Feedback']),
  message: z.string().min(5),
});

type Topic = z.infer<typeof schema>['topic'];

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30">
      <div className="container-responsive py-12 mx-8">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border border-orange-100 shadow-sm">
              <CardHeader className="border-b border-orange-50">
                <h3 className="text-xl font-semibold text-gray-900">Visit Us</h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Haveli Indian Kitchen</p>
                      <p className="text-gray-600">12908 N Dale Mabry Hwy</p>
                      <p className="text-gray-600">Tampa, FL 33618</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-orange-600 flex-shrink-0" />
                    <Link href="tel:+18134886294" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                      (813) 488-6294
                    </Link>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Hours</p>
                      <p className="text-gray-600 text-sm">Mon-Thu: 11:30 AM - 9:30 PM</p>
                      <p className="text-gray-600 text-sm">Fri-Sat: 11:30 AM - 10:00 PM</p>
                      <p className="text-gray-600 text-sm">Sunday: 12:00 PM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border border-orange-100 shadow-sm overflow-hidden">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3520.702614129809!2d-82.5053142!3d28.0641035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c15ee95eab43%3A0xdd5a43168c132d9b!2sHaveli%20Indian%20Kitchen!5e0!3m2!1sen!2sus!4v1757308140368!5m2!1sen!2sus"
                width="100%"
                height="280"
                loading="lazy"
                className="border-0"
              />
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border border-orange-100 shadow-sm">
              <CardHeader className="border-b border-orange-50">
                <h3 className="text-xl font-semibold text-gray-900">Send a Message</h3>
                <p className="text-gray-600 text-sm">We'll get back to you soon</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                    <Input 
                      {...form.register('name')} 
                      placeholder="Your name"
                      className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                      <Input 
                        type="email" 
                        {...form.register('email')} 
                        placeholder="your@email.com"
                        className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20" 
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
                      <Input 
                        {...form.register('phone')} 
                        placeholder="(555) 123-4567"
                        className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Topic</label>
                    <Select
                      value={form.watch('topic')}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => form.setValue('topic', e.target.value as Topic)}
                      className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20">
                      {(['General', 'Order', 'Catering', 'Feedback'] as const).map((t) => (
                        <option value={t} key={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                    <Textarea 
                      rows={5} 
                      {...form.register('message')} 
                      placeholder="How can we help you?"
                      className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 resize-none" 
                    />
                  </div>
                  
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 transition-colors"
                  >
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
