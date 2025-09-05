"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { categories, getMenuByCategory } from "@/data/menu";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/store/cart";
import { toast } from "@/components/ui/use-toast";

export default function MenuPage() {
  const [active, setActive] = useState(categories[0]);
  const add = useCartStore((s) => s.add);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const items = getMenuByCategory(active);
  return (
    <div>
      <Tabs value={active} onValueChange={(v) => setActive(v as any)}>
        <TabsList>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c} active={active === c} onClick={(v) => setActive(v as any)} />
          ))}
        </TabsList>
      </Tabs>
      <section className="container-responsive py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4">
                    <div className="skeleton h-4 w-1/2" />
                    <div className="mt-2 skeleton h-3 w-3/4" />
                    <div className="mt-4 skeleton h-8 w-24" />
                  </div>
                </div>
              ))
            : items.map((item) => (
                <div key={item.id} className="card overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-[--color-brand] font-semibold">{formatCurrency(item.priceCents)}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                    <div className="mt-2 flex gap-2">
                      {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
                      {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
                    </div>
                    <div className="mt-4">
                      <Button
                        onClick={() => {
                          add({ id: item.id, name: item.name, priceCents: item.priceCents }, 1);
                          toast.success(`${item.name} added to cart`);
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>
    </div>
  );
}
