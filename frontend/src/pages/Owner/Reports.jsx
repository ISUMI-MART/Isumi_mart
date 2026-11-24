
import { useEffect, useState } from "react";
import {
  getOrders,
  getProducts,
  getWalkInSales,
} from "../../services/api";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [walkInSales, setWalkInSales] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // FORMAT MONEY
  // ===============================

  function money(amount) {
    return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // ===============================
  // LOAD REPORT DATA FROM BACKEND
  // ===============================

  useEffect(() => {
    loadReportData();
  }, []);

  async function loadReportData() {
    try {
      setLoading(true);
      setError("");

      const [ordersResult, productsResult, salesResult] =
        await Promise.all([
          getOrders(),
          getProducts({ page: 1, limit: 100 }),
          getWalkInSales(),
        ]);

      // Normalize online orders response
      const ordersList = Array.isArray(ordersResult)
        ? ordersResult
        : ordersResult.orders ||
          ordersResult.data?.orders ||
          ordersResult.data ||
          [];

      // Products API already returns a formatted products array
      const productsList = productsResult.products || [];

      // Walk-in sales API already returns an array
      const salesList = Array.isArray(salesResult)
        ? salesResult
        : [];

      setOrders(ordersList);
      setProducts(productsList);
      setWalkInSales(salesList);
    } catch (err) {
      console.error("Reports loading error:", err);
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // ONLINE SALES
  // ===============================

  const deliveredOrders = orders.filter(
    (order) => order.status?.toUpperCase() === "DELIVERED"
  );

  const onlineRevenue = deliveredOrders.reduce(
    (total, order) =>
      total + Number(order.totalAmount ?? order.total ?? 0),
    0
  );

  // ===============================
  // WALK-IN SALES
  // ===============================

  const walkInRevenue = walkInSales.reduce(
    (total, sale) =>
      total + Number(sale.totalAmount ?? sale.total ?? 0),
    0
  );

  // ===============================
  // OVERALL SALES
  // ===============================

  const totalRevenue = onlineRevenue + walkInRevenue;

  const totalSales = orders.length + walkInSales.length;

  // ===============================
  // OTHER ORDER INFORMATION
  // ===============================

  const pendingOrders = orders.filter(
    (order) => order.status?.toUpperCase() !== "DELIVERED"
  );

  // ===============================
  // LOW STOCK PRODUCTS
  // ===============================

  const lowStockProducts = products.filter((product) => {
    const available = Number(product.available ?? 0);

    const threshold = Number(
      product.stockConfig?.lowStockThreshold ?? 5
    );

    return available <= threshold;
  });

  // ===============================
  // REPORT STATISTICS
  // ===============================

  const reports = [
    ["Total Sales", totalSales],
    ["Total Revenue", money(totalRevenue)],
    ["Online Revenue", money(onlineRevenue)],
    ["Walk-in Revenue", money(walkInRevenue)],
    ["Delivered Orders", deliveredOrders.length],
    ["Other Online Orders", pendingOrders.length],
    ["Total Products", products.length],
    ["Low Stock Products", lowStockProducts.length],
  ];

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <section className="content">
        <div className="eyebrow">BUSINESS REPORTS</div>
        <h1 className="heading">Reports</h1>
        <p className="empty">Loading reports...</p>
      </section>
    );
  }

  // ===============================
  // ERROR
  // ===============================

  if (error) {
    return (
      <section className="content">
        <div className="eyebrow">BUSINESS REPORTS</div>
        <h1 className="heading">Reports</h1>

        <p className="sale-error">{error}</p>

        <button className="btn" onClick={loadReportData}>
          Try again
        </button>
      </section>
    );
  }

  // ===============================
  // REPORT SCREEN
  // ===============================

  return (
    <section className="content">
      <div className="eyebrow">BUSINESS REPORTS</div>

      <h1 className="heading">Reports</h1>

      <p className="sub">
        Review your grocery shop performance.
      </p>

      {/* BUSINESS STATISTICS */}

      <div className="stats">
        {reports.map(([label, value]) => (
          <div className="stat" key={label}>
            <div className="stat-top">{label}</div>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {/* REVENUE SUMMARY */}

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

      {/* ORDER SUMMARY */}

      <div className="panel">
        <div className="panelhead">
          <h3>Order Summary</h3>
        </div>

        <p>Total online orders: {orders.length}</p>

        <p>Delivered orders: {deliveredOrders.length}</p>

        <p>Other online orders: {pendingOrders.length}</p>

        <p>Total walk-in sales: {walkInSales.length}</p>
      </div>

      {/* INVENTORY SUMMARY */}

      <div className="panel">
        <div className="panelhead">
          <h3>Inventory Summary</h3>
        </div>

        <p>Total products: {products.length}</p>

        <p>Low stock products: {lowStockProducts.length}</p>

        <p>
          Out of stock products:{" "}
          {
            products.filter(
              (product) => Number(product.available ?? 0) <= 0
            ).length
          }
        </p>
      </div>
    </section>
  );
}

export default Reports;
