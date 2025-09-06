export type MenuCategoryKey =
  | "Appetizers Veg"
  | "Appetizers Non-Veg"
  | "Entrees Veg"
  | "Entrees Chicken"
  | "Breads"
  | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  category: MenuCategoryKey;
  veg?: boolean;
  spicy?: boolean;
  featured?: boolean;
};

export const categories: MenuCategoryKey[] = [
  "Appetizers Veg",
  "Appetizers Non-Veg",
  "Entrees Veg",
  "Entrees Chicken",
  "Breads",
  "Drinks",
];

export const menu: MenuItem[] = [
  {
    id: "veg-samosa",
    name: "Samosa",
    description: "Crispy pastry stuffed with spiced potatoes and peas.",
    priceCents: 399,
    image: "/images/samosa.jpg",
    category: "Appetizers Veg",
    veg: true,
    featured: true,
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    description: "Marinated cottage cheese grilled to perfection.",
    priceCents: 1299,
    image: "/images/paneertikka.jpg",
    category: "Appetizers Veg",
    veg: true,
    featured: true,
  },
  {
    id: "chicken-tikka",
    name: "Chicken Tikka",
    description: "Boneless chicken, yogurt marinade, charred edges.",
    priceCents: 1499,
    image: "/images/placeholder.svg",
    category: "Appetizers Non-Veg",
    spicy: true,
  },
  {
    id: "butter-chicken",
    name: "Butter Chicken",
    description: "Creamy tomato sauce, tender chicken, fenugreek.",
    priceCents: 1699,
    image: "/images/placeholder.svg",
    category: "Entrees Chicken",
    featured: true,
  },
  {
    id: "chana-masala",
    name: "Chana Masala",
    description: "Chickpeas in a tangy, spiced gravy.",
    priceCents: 1299,
    image: "/images/placeholder.svg",
    category: "Entrees Veg",
    veg: true,
    spicy: true,
  },
  {
    id: "naan",
    name: "Butter Naan",
    description: "Soft tandoor-baked leavened bread.",
    priceCents: 399,
    image: "/images/placeholder.svg",
    category: "Breads",
  },
  {
    id: "mango-lassi",
    name: "Mango Lassi",
    description: "Sweet mango yogurt smoothie.",
    priceCents: 499,
    image: "/images/placeholder.svg",
    category: "Drinks",
    veg: true,
  },
];

export const getMenuByCategory = (cat: MenuCategoryKey) => menu.filter((m) => m.category === cat);
export const getItemById = (id: string) => menu.find((m) => m.id === id);
