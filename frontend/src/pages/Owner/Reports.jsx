import { money } from "../../data/ownerData";

function Reports({ orders = [], products = [], walkInSales = [] }) {

  // Online sales
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const onlineRevenue = deliveredOrders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  // Walk-in sales
  const walkInRevenue = walkInSales.reduce(
    (total, sale) => total + Number(sale.total || 0),
    0
  );

  // Overall sales
  const totalRevenue = onlineRevenue + walkInRevenue;

  const totalSales = orders.length + walkInSales.length;

  // Other order information
  const pendingOrders = orders.filter(
    (order) => order.status !== "Delivered"
  );

  // Low stock products
  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) <= Number(product.lowStockThreshold)
  );

  const reports = [
    ["Total Sales", totalSales],
    ["Total Revenue", money(totalRevenue)],
    ["Online Revenue", money(onlineRevenue)],
    ["Walk-in Revenue", money(walkInRevenue)],
    ["Delivered Orders", deliveredOrders.length],
    ["Pending Orders", pendingOrders.length],
    ["Total Products", products.length],
    ["Low Stock Products", lowStockProducts.length],
  ];

  return (
    <section className="content">
      <div className="eyebrow">BUSINESS REPORTS</div>

      <h1 className="heading">Reports</h1>

      <p className="sub">
        Review your grocery shop performance.
      </p>

      {/* Business statistics */}
      <div className="stats">
        {reports.map(([label, value]) => (
          <div className="stat" key={label}>
            <div className="stat-top">{label}</div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {/* Revenue summary */}
      <div className="panel">
        <div className="panelhead">
          <h3>Sales Summary</h3>
        </div>

        <p>Total sales: {totalSales}</p>

        <p>Online revenue: {money(onlineRevenue)}</p>

        <p>Walk-in revenue: {money(walkInRevenue)}</p>

        <p>
          <strong>Total revenue: {money(totalRevenue)}</strong>
        </p>
      </div>

      {/* Order summary */}
      <div className="panel">
        <div className="panelhead">
          <h3>Order Summary</h3>
        </div>

        <p>Total online orders: {orders.length}</p>

        <p>Delivered orders: {deliveredOrders.length}</p>

        <p>Other orders: {pendingOrders.length}</p>

        <p>Total walk-in sales: {walkInSales.length}</p>
      </div>

    </section>
  );
}

export default Reports;