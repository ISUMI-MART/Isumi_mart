
export const initialProducts = [
  {
    id: "PR-001",
    name: "Tomato",
    category: "Vegetables",
    unit: "1 kg",
    price: 320,
    stock: 42,
    status: "In Stock",
    emoji: "🍅",
  },
  {
    id: "PR-002",
    name: "Carrot",
    category: "Vegetables",
    unit: "1 kg",
    price: 280,
    stock: 8,
    status: "Low Stock",
    emoji: "🥕",
  },
  {
    id: "PR-003",
    name: "Banana (Ambul)",
    category: "Fruits",
    unit: "1 dozen",
    price: 240,
    stock: 25,
    status: "In Stock",
    emoji: "🍌",
  },
  {
    id: "PR-004",
    name: "Papaya",
    category: "Fruits",
    unit: "1 kg",
    price: 350,
    stock: 0,
    status: "Out of Stock",
    emoji: "🍈",
  },
  {
    id: "PR-005",
    name: "Fresh Milk 1L",
    category: "Dairy & Eggs",
    unit: "1 L",
    price: 480,
    stock: 19,
    status: "In Stock",
    emoji: "🥛",
  },
  {
    id: "PR-006",
    name: "Eggs",
    category: "Dairy & Eggs",
    unit: "10 pcs",
    price: 900,
    stock: 13,
    status: "In Stock",
    emoji: "🥚",
  },
  {
    id: "PR-007",
    name: "Red Rice",
    category: "Rice & Grains",
    unit: "1 kg",
    price: 260,
    stock: 31,
    status: "In Stock",
    emoji: "🍚",
  },
];

export const initialOrders = [
  {
    id: "IM-1048",
    customer: "Nimali Perera",
    date: "03 Nov 2026",
    items: "Tomato, Eggs, Fresh Milk",
    total: 1700,
    status: "Pending",
    agent: "Unassigned",
    address: "Negombo",
  },
  {
    id: "IM-1047",
    customer: "Kasun Silva",
    date: "03 Nov 2026",
    items: "Carrot, Banana",
    total: 520,
    status: "Processing",
    agent: "Ruwan",
    address: "Kochchikade",
  },
  {
    id: "IM-1046",
    customer: "Tharushi Fernando",
    date: "02 Nov 2026",
    items: "Red Rice, Eggs",
    total: 1420,
    status: "Out for Delivery",
    agent: "Nuwan",
    address: "Ja-Ela",
  },
  {
    id: "IM-1045",
    customer: "Amal Jayasinghe",
    date: "02 Nov 2026",
    items: "Milk, Papaya",
    total: 830,
    status: "Delivered",
    agent: "Ruwan",
    address: "Negombo",
  },
];

export const money = (n) =>
  "Rs. " + Number(n).toLocaleString("en-LK");

export const read = (key, defaultValue) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
  } catch {
    return defaultValue;
  }
};
