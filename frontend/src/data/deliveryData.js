
export const initialDeliveryOrders = [
  {
    id: "IM-1046",
    customer: "Tharushi Fernando",
    phone: "077 234 5678",
    address: "No. 18, Main Street, Ja-Ela",
    area: "Ja-Ela",
    items: ["Red Rice × 2", "Eggs × 1"],
    total: 1420,
    status: "Assigned",
    time: "10:30 AM",
    note: "Please call on arrival.",
  },
  {
    id: "IM-1047",
    customer: "Kasun Silva",
    phone: "071 456 7890",
    address: "42, Sea Street, Kochchikade",
    area: "Kochchikade",
    items: ["Carrot × 1", "Banana × 1"],
    total: 520,
    status: "Assigned",
    time: "11:15 AM",
    note: "Cash on delivery.",
  },
  {
    id: "IM-1044",
    customer: "Dilani Perera",
    phone: "076 321 4567",
    address: "12, St. Mary's Road, Negombo",
    area: "Negombo",
    items: ["Fresh Milk × 2", "Tomato × 1"],
    total: 1280,
    status: "Delivered",
    time: "Yesterday",
    note: "",
  },
];

export const money = (amount) =>
  "Rs. " + Number(amount).toLocaleString("en-LK");

export const readDeliveryOrders = () => {
  try {
    const saved = localStorage.getItem("isumi-agent-orders");

    return saved
      ? JSON.parse(saved)
      : initialDeliveryOrders;
  } catch {
    return initialDeliveryOrders;
  }
};
