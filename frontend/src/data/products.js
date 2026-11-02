// All product data lives here, so Home, Products, ProductDetails and Cart share ONE list.
// Later, backend can replace this file with an API call.

export const categories = [
  "All",
  "Vegetables",
  "Fruits",
  "Dairy & Eggs",
  "Rice & Grains",
  "Beverages",
  "Household",
];

// Shown on the Home page "Browse our market" cards (same text as the reference site)
export const homeCategories = [
  { name: "Vegetables", count: 12, icon: "🥕" },
  { name: "Fruits", count: 9, icon: "🍎" },
  { name: "Dairy & Eggs", count: 7, icon: "🥛" },
  { name: "Rice & Grains", count: 8, icon: "🌾" },
  { name: "Beverages", count: 6, icon: "🧃" },
  { name: "Household", count: 10, icon: "🧹" },
];

// Stock label rule: 0 = Out of Stock, 1-10 = Low Stock, more = In Stock
export function getStockLabel(available) {
  if (available <= 0) return "Out of Stock";
  if (available <= 10) return "Low Stock";
  return "In Stock";
}

const rawProducts = [
  { id: "p1", name: "Tomato", category: "Vegetables", unit: "1 kg", price: 320, available: 40, expiry: "2026-08-25", icon: "🍅", image: "/images/tomato.jpg" },
  { id: "p2", name: "Carrot", category: "Vegetables", unit: "1 kg", price: 280, available: 6, expiry: "2026-08-24", icon: "🥕", image: "/images/carrot.jpg" },
  { id: "p3", name: "Banana (Ambul)", category: "Fruits", unit: "1 dozen", price: 240, available: 25, expiry: "2026-08-21", icon: "🍌", image: "/images/banana.jpg" },
  { id: "p4", name: "Papaya", category: "Fruits", unit: "1 kg", price: 350, available: 0, expiry: "2026-08-28", icon: "🥭", image: "/images/papaya.jpg" },
  { id: "p5", name: "Fresh Milk 1L", category: "Dairy & Eggs", unit: "1 L", price: 480, available: 18, expiry: "2026-08-22", icon: "🥛", image: "/images/freshmilk.jpg" },
  { id: "p6", name: "Eggs", category: "Dairy & Eggs", unit: "10 pcs", price: 900, available: 30, expiry: "2026-09-10", icon: "🥚", image: "/images/egg.jpg" },
  { id: "p7", name: "Red Raw Rice", category: "Rice & Grains", unit: "1 kg", price: 260, available: 120, expiry: "2027-01-15", icon: "🌾", image: "/images/redrice.jpg" },
  { id: "p8", name: "Dhal", category: "Rice & Grains", unit: "1 kg", price: 410, available: 9, expiry: "2026-12-01", icon: "🫘", image: "/images/dhal.jpg" },
  { id: "p9", name: "Tea Pack", category: "Beverages", unit: "200 g", price: 690, available: 22, expiry: "2027-03-01", icon: "🍵", image: "/images/tea.jpg" },
  { id: "p10", name: "Dish Wash Liquid", category: "Household", unit: "500 ml", price: 520, available: 14, expiry: "2027-06-01", icon: "🧴", image: "/images/dishwash.png" },
  { id: "p11", name: "Coconut Oil", category: "Household", unit: "750 ml", price: 1150, available: 4, expiry: "2026-09-05", icon: "🥥", image: "/images/coconutoil.jpg" },
  { id: "p12", name: "Yoghurt Cup", category: "Dairy & Eggs", unit: "80 g", price: 130, available: 60, expiry: "2026-08-20", icon: "🥣", image: "/images/yoghurt.jpg" },
];

export const products = rawProducts.map((p) => ({
  ...p,
  stock: getStockLabel(p.available),
}));

export const PRODUCT_DESCRIPTION =
  "Product description placeholder — short text about the item, storage advice and origin.";

export function getProductById(id) {
  return products.find((p) => p.id === id);
}