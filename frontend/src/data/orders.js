// Order helpers + sample orders (same sample orders as the reference site).
// Orders you place are saved in localStorage under "isumiOrders".
// backend can replace these functions with API calls.

export const DELIVERY_FEE = 250;

const STORAGE_KEY = "isumiOrders";

export const sampleOrders = [
  {
    id: "ORD-1042",
    date: "2026-08-18",
    status: "Order Placed",
    payment: "Cash on Delivery",
    paymentStatus: "Pending",
    items: [
      { id: "p1", name: "Tomato", quantity: 2, price: 320 },
      { id: "p5", name: "Fresh Milk 1L", quantity: 3, price: 480 },
    ],
    subtotal: 2080,
    deliveryFee: 250,
    discount: 100,
    total: 2230,
    address: { street: "No 12, Temple Road", city: "Kadawatha", phone: "071 234 5678" },
    agent: null,
  },
  {
    id: "ORD-1041",
    date: "2026-08-18",
    status: "Out for Delivery",
    payment: "Cash on Delivery",
    paymentStatus: "Pending",
    items: [{ id: "p7", name: "Red Raw Rice", quantity: 5, price: 260 }],
    subtotal: 1300,
    deliveryFee: 250,
    discount: 0,
    total: 1550,
    address: { street: "45/2, Station Lane", city: "Ragama", phone: "077 998 1122" },
    agent: "Kasun (Agent)",
  },
  {
    id: "ORD-1040",
    date: "2026-08-17",
    status: "Delivered",
    payment: "Cash on Delivery",
    paymentStatus: "Paid",
    items: [{ id: "p6", name: "Eggs", quantity: 2, price: 900 }],
    subtotal: 1800,
    deliveryFee: 250,
    discount: 0,
    total: 2050,
    address: { street: "8, Lake View", city: "Gampaha", phone: "076 555 4433" },
    agent: "Kasun (Agent)",
  },
  {
    id: "ORD-1039",
    date: "2026-08-16",
    status: "Cancelled",
    payment: "Cash on Delivery",
    paymentStatus: "Pending",
    items: [{ id: "p4", name: "Papaya", quantity: 1, price: 350 }],
    subtotal: 350,
    deliveryFee: 250,
    discount: 0,
    total: 600,
    address: { street: "23, Main Street", city: "Kiribathgoda", phone: "070 111 2233" },
    agent: null,
  },
];

export function getStoredOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// Newest first: your new orders, then the sample orders
export function getAllOrders() {
  return [...getStoredOrders().slice().reverse(), ...sampleOrders];
}

export function getOrderById(id) {
  return getAllOrders().find((order) => order.id === id);
}

export function getNextOrderId() {
  const numbers = getAllOrders().map((o) => parseInt(String(o.id).replace("ORD-", ""), 10));
  const highest = Math.max(1041, ...numbers.filter((n) => !Number.isNaN(n)));
  return "ORD-" + (highest + 1);
}

export function saveOrder(order) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...getStoredOrders(), order]));
  localStorage.setItem("latestOrder", JSON.stringify(order));
}

// Works for both an address object and a plain string
export function formatAddress(address) {
  if (!address) return "";
  if (typeof address === "string") return address;
  return [address.street, address.city].filter(Boolean).join(", ");
}
