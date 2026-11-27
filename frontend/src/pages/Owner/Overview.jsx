import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Layouts/Owner.css"


import TableOrders from "../../components/Owner/TableOrders";

import {
  getProducts,
  getOrders,
  getStock,
  updateOrderStatus,
} from "../../services/api";

function Overview() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // LOAD OWNER DASHBOARD DATA

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, ordersResponse, stockResponse] =
          await Promise.all([getProducts(), getOrders(), getStock()]);

        console.log("Products:", productsResponse);

        console.log("Orders:", ordersResponse);

        console.log("Stock:", stockResponse);

        const productsData = Array.isArray(productsResponse)
          ? productsResponse
          : productsResponse?.products || productsResponse?.data || [];

        const ordersData = Array.isArray(ordersResponse)
          ? ordersResponse
          : ordersResponse?.orders || ordersResponse?.data || [];

        const stockData = Array.isArray(stockResponse)
          ? stockResponse
          : stockResponse?.stock || stockResponse?.data || [];

        setProducts(productsData);
        setOrders(ordersData);
        setStock(stockData);
      } catch (err) {
        console.error("Dashboard loading error:", err);

        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const updateOrder = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );
    } catch (err) {
      console.error("Order status update error:", err);

      alert(err.message || "Failed to update order status.");
    }
  };

  const pending = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.status),
  ).length;

  const lowStock = stock.filter((item) => {
    const quantity = Number(
      item.quantity ?? item.stock ?? item.currentStock ?? 0,
    );

    const threshold = Number(item.lowStockThreshold ?? item.threshold ?? 5);

    return quantity > 0 && quantity <= threshold;
  });

  const stats = [
    ["Total orders", orders.length, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-chart-gantt preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>, "Across all time"],
    ["To be processed", pending, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock preview-icon"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, "Orders needing attention"],
    ["Products", products.length, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-top-dashed preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M14 9h1"/><path d="M19 9h2"/><path d="M3 9h2"/><path d="M9 9h1"/></svg>, "Active catalogue"],
    ["Low stock items", lowStock.length, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flag preview-icon"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/></svg>, "Restock soon"],
  ];


  if (loading) {
    return (
      <section className="content">
        <div className="eyebrow">OWNER DASHBOARD</div>

        <h1 className="heading">Shop overview</h1>

        <p className="sub">Loading dashboard data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="content">
        <div className="eyebrow">OWNER DASHBOARD</div>

        <h1 className="heading">Shop overview</h1>

        <div className="panel">
          <p
            style={{
              color: "#b42318",
            }}
          >
            {error}
          </p>

          <button
            className="btn light"
            onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="eyebrow">OWNER DASHBOARD</div>

      <div className="row">
        <div>
          <h1 className="heading">Shop overview</h1>
          <p className="sub">
            Here is what is happening with your grocery shop today.
          </p>
        </div>
      </div>

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

      <div className="grid2">
        {/* RECENT ORDERS */}

        <div className="panel">
          <div className="panelhead">
            <h3>Recent orders</h3>

            <button
              className="btn light"
              onClick={() => navigate("/owner/orders")}
            >
              View all <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right preview-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          {orders.length > 0 ? (
            <TableOrders
              orders={orders.slice(0, 4)}
              updateOrder={updateOrder}
            />
          ) : (
            <p className="muted">No orders found.</p>
          )}
          
        </div>

        {/* INVENTORY */}

        <div className="panel">
          <div className="panelhead">
            <h3>Inventory alerts</h3>

            <button
              className="btn light"
              onClick={() => navigate("/owner/inventory")}
            >
              View stock <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right preview-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          {lowStock.map((item) => {
            const product = item.product || {};

            const quantity =
              item.quantity ?? item.stock ?? item.currentStock ?? 0;

            return (
              <div
                className="row"
                key={item.id || product.id}
                style={{
                  padding: "11px 0",
                  borderBottom: "1px solid #f0f3f0",
                }}
              >
                <div className="productcell">
                  <span className="thumb">
                    {product.imageUrl || product.image ? (
                      <img
                        src={product.imageUrl || product.image}
                        alt={product.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      product.emoji || <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package preview-icon"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>
                    )}
                  </span>

                  <div>
                    <b className="strong">
                      {product.name || item.productName || "Product"}
                    </b>

                    <div className="muted">
                      {product.category?.name || product.category || ""}
                    </div>
                  </div>
                </div>

                <span className="pill orange">{quantity} {product.unit} left</span>
              </div>
            );
          })}

          {lowStock.length === 0 && (
            <p className="muted">No low-stock products.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>Quick actions</h3>
        </div>

        <div className="quickgrid">
          {[
            [<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus preview-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
              "Add a product","Update your shop catalogue","/owner/inventory",],

            [<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-chart-gantt preview-icon"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 8h7"/><path d="M8 12h6"/><path d="M11 16h5"/></svg>,
              "Review new orders","Process customer purchases", "/owner/orders", ],

            [ <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moped preview-icon"><path d="m18.16 14.12-2.927-8.447A1 1 0 0 0 14.288 5H13"/><path d="M19 10a7 7 0 0 0-6.928 6"/><path d="M2 10h5.5a3 3 0 0 1 2.747 1.795l1.669 3.803A1 1 0 0 1 11.01 17H8"/><circle cx="19" cy="17" r="3"/><circle cx="5" cy="17" r="3"/></svg>,
              "Delivery team","Check delivery assignments","/owner/delivery-agents",],

          ].map(([icon, title, description, path]) => (
            <button
              className="quick"
              key={title}
              onClick={() => navigate(path)}
              style={{ textAlign: "left", cursor: "pointer" }}
            >
              <span>{icon}</span>
              <b>{title}</b>

              <small>{description}  </small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Overview;
