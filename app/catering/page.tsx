'use client';
import { cateringPackages, addOns } from '@/data/catering';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';
import { useState } from 'react';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  date: z.string().min(4),
  time: z.string().min(1),
  headcount: z.number().min(10),
  venue: z.string().min(2),
  notes: z.string().max(500).optional(),
});

export default function CateringPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Sample menu items with tray sizes and categories
  const dishMenu = [
    {
      id: "butter-chicken",
      name: "Butter Chicken",
      description: "Creamy tomato-based curry with tender chicken",
      category: "Chicken Entrees",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 5999 },
        { size: "Medium", serves: "20-25 people", price: 9999 },
        { size: "Large", serves: "30-40 people", price: 14999 }
      ]
    },
    {
      id: "chicken-tikka",
      name: "Chicken Tikka",
      description: "Marinated grilled chicken pieces",
      category: "Appetizers",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 3999 },
        { size: "Medium", serves: "20-25 people", price: 6999 },
        { size: "Large", serves: "30-40 people", price: 9999 }
      ]
    },
    {
      id: "chicken-biryani",
      name: "Chicken Biryani",
      description: "Fragrant basmati rice with spiced chicken",
      category: "Chicken Entrees",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 6999 },
        { size: "Medium", serves: "20-25 people", price: 11999 },
        { size: "Large", serves: "30-40 people", price: 16999 }
      ]
    },
    {
      id: "channa-masala",
      name: "Channa Masala",
      description: "Spiced chickpeas in rich tomato gravy",
      category: "Vegetarian Entrees",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 4999 },
        { size: "Medium", serves: "20-25 people", price: 7999 },
        { size: "Large", serves: "30-40 people", price: 11999 }
      ]
    },
    {
      id: "palak-paneer",
      name: "Palak Paneer",
      description: "Cottage cheese in creamy spinach gravy",
      category: "Vegetarian Entrees",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 5499 },
        { size: "Medium", serves: "20-25 people", price: 8999 },
        { size: "Large", serves: "30-40 people", price: 12999 }
      ]
    },
    {
      id: "samosa",
      name: "Vegetable Samosa",
      description: "Crispy pastries filled with spiced vegetables",
      category: "Appetizers",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 2999 },
        { size: "Medium", serves: "20-25 people", price: 4999 },
        { size: "Large", serves: "30-40 people", price: 6999 }
      ]
    },
    {
      id: "basmati-rice",
      name: "Basmati Rice",
      description: "Aromatic long-grain rice",
      category: "Rice & Bread",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 2499 },
        { size: "Medium", serves: "20-25 people", price: 3999 },
        { size: "Large", serves: "30-40 people", price: 5499 }
      ]
    },
    {
      id: "naan-bread",
      name: "Butter Naan",
      description: "Fresh baked bread with butter",
      category: "Rice & Bread",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 2999 },
        { size: "Medium", serves: "20-25 people", price: 4999 },
        { size: "Large", serves: "30-40 people", price: 6999 }
      ]
    },
    {
      id: "gulab-jamun",
      name: "Gulab Jamun",
      description: "Sweet milk dumplings in sugar syrup",
      category: "Desserts",
      sizes: [
        { size: "Small", serves: "10-15 people", price: 3499 },
        { size: "Medium", serves: "20-25 people", price: 5499 },
        { size: "Large", serves: "30-40 people", price: 7499 }
      ]
    }
  ];

  const categories = ['All', 'Appetizers', 'Chicken Entrees', 'Vegetarian Entrees', 'Rice & Bread', 'Desserts'];
  const filteredItems = activeCategory === 'All' 
    ? dishMenu 
    : dishMenu.filter(item => item.category === activeCategory);

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

  const handleSizeChange = (itemId: string, sizeIndex: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: sizeIndex
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-amber-50/30">
      <div className="container-responsive py-8 px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Catering Menu</h1>
          <p className="text-gray-600">Choose your dishes and tray sizes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="mb-6">
              {/* Mobile Dropdown */}
              <div className="md:hidden">
                <Select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full border-orange-200 focus:border-orange-400"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </div>
              
              {/* Desktop Buttons */}
              <div className="hidden md:flex gap-2 p-1 bg-gray-100 rounded-lg">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-600 hover:text-orange-600 hover:bg-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              {filteredItems.map((item) => {
              const selectedIndex = parseInt(selectedSizes[item.id] || "0");
              const selectedSize = item.sizes[selectedIndex];
              
              return (
                <Card key={item.id} className="border border-orange-100 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Select
                          value={selectedSizes[item.id] || "0"}
                          onChange={(e) => handleSizeChange(item.id, e.target.value)}
                          className="min-w-[160px] border-orange-200 focus:border-orange-400"
                        >
                          {item.sizes.map((size, index) => (
                            <option key={index} value={index}>
                              {size.size} - {formatCurrency(size.price)}
                            </option>
                          ))}
                        </Select>
                        
                        <div className="text-xs text-gray-500 min-w-[70px] text-right">
                          {selectedSize.serves}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          </div>

          {/* Request Form */}
          <div>
            <Card className="border border-orange-100 shadow-sm sticky top-4">
              <CardHeader className="border-b border-orange-50">
                <h3 className="font-semibold text-gray-900">Request Quote</h3>
                <p className="text-sm text-gray-600">Tell us about your event</p>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                  <Input 
                    {...form.register('name')} 
                    className="border-gray-200 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    type="email" 
                    {...form.register('email')} 
                    className="border-gray-200 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                  <Input 
                    {...form.register('phone')} 
                    className="border-gray-200 focus:border-orange-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Date</label>
                    <Input 
                      type="date" 
                      {...form.register('date')} 
                      className="border-gray-200 focus:border-orange-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
                    <Input 
                      type="time" 
                      {...form.register('time')} 
                      className="border-gray-200 focus:border-orange-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Expected Guests</label>
                  <Input 
                    type="number" 
                    min={10} 
                    {...form.register('headcount', { valueAsNumber: true })} 
                    className="border-gray-200 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Venue</label>
                  <Input 
                    {...form.register('venue')} 
                    className="border-gray-200 focus:border-orange-400"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Special Requests</label>
                  <Textarea 
                    {...form.register('notes')} 
                    rows={3}
                    className="border-gray-200 focus:border-orange-400 resize-none"
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                >
                  Request Quote
                </Button>
                
                {env.catering.depositEnabled && (
                  <form action="/api/catering-deposit" method="POST">
                    <Button 
                      type="submit" 
                      variant="outline" 
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 mt-2"
                    >
                      Pay Deposit ({formatCurrency(env.catering.depositAmountCents)})
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
