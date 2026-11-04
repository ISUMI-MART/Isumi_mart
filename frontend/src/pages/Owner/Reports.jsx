
import { money } from "../../data/ownerData";

function Reports({ orders, products }) {
  const delivered = orders.filter(
    (order) => order.status === "Delivered"
  );

  const revenue = delivered.reduce(
    (total, order) => total + order.total,
    0
  );

  const reports = [
    ["Total orders", orders.length],
    ["Delivered orders", delivered.length],
    ["Revenue (delivered)", money(revenue)],
    ["Total products", products.length],
  ];

  return (
    <section className="content">
      <div className="eyebrow">BUSINESS REPORTS</div>

      <h1 className="heading">Reports</h1>
      <p className="sub">
        Review your grocery shop performance.
      </p>

      <div className="stats">
        {reports.map(([label, value]) => (
          <div className="stat" key={label}>
            <div className="stat-top">{label}</div>
            <strong>{value}</strong>
            <small>Current demo data</small>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>Order summary</h3>
        </div>

        <p>Total orders: {orders.length}</p>
        <p>Delivered: {delivered.length}</p>
        <p>Other orders: {orders.length - delivered.length}</p>
        <p>Delivered revenue: {money(revenue)}</p>
      </div>
    </section>
  );
}

export default Reports;
