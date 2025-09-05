export type CateringPackage = {
  id: string;
  name: string;
  pricePerPersonCents: number;
  minGuests: number;
  inclusions: string[];
};

export const cateringPackages: CateringPackage[] = [
  {
    id: "classic",
    name: "Classic Haveli",
    pricePerPersonCents: 1599,
    minGuests: 25,
    inclusions: ["2 Appetizers", "2 Entrees", "Rice", "Naan", "Salad"],
  },
  {
    id: "premium",
    name: "Premium Feast",
    pricePerPersonCents: 2199,
    minGuests: 25,
    inclusions: ["3 Appetizers", "3 Entrees", "Rice", "Naan", "Dessert", "Salad"],
  },
];

export const addOns = [
  { id: "chaat-station", name: "Chaat Station", priceCents: 29999 },
  { id: "gulab-jamun", name: "Gulab Jamun Tray", priceCents: 4999 },
  { id: "samosa-tray", name: "Samosa Tray", priceCents: 3999 },
];

