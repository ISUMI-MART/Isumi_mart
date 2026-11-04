
import { money } from "../../data/deliveryData";

function DeliveryStats({ orders }) {
  const active = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;

  const completed = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const inProgress = orders.filter(
    (order) =>
      order.status === "On the way" ||
      order.status === "Picked up"
  ).length;

  const cashToCollect = orders
    .filter((order) => order.status !== "Delivered")
    .reduce((total, order) => total + order.total, 0);

  const stats = [
    ["Assigned deliveries", active, "▤", "Ready to complete"],
    ["Completed", completed, "✓", "Successfully delivered"],
    ["In progress", inProgress, "◷", "Currently on route"],
    ["Cash to collect", money(cashToCollect), "₨", "Pending COD total"],
  ];

  return (
    <div className="stats">
      {stats.map(([label, value, icon, description]) => (
        <div className="stat" key={label}>
          <div className="stat-top">
            <span>{label}</span>
            <span className="stat-icon">{icon}</span>
          </div>

          <strong>{value}</strong>
          <small>{description}</small>
        </div>
      ))}
    </div>
  );
}

export default DeliveryStats;
