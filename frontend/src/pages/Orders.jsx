import React from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../data/orders";

function Orders() {
  const navigate = useNavigate();

  // TODO (backend): replace with GET /api/orders for the logged-in customer
  const orders = getAllOrders();

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1>Order History</h1>

        <div className="orders-list">
          {orders.map((order) => {
            const isCancelled = order.status === "Cancelled";

            return (
              <div className="order-history-card" key={order.id}>
                <div className="order-history-info">
                  <strong>{order.id}</strong>
                  <span>
                    {order.date} · {order.items.length} item(s) · Rs.{" "}
                    {order.total.toLocaleString()}
                  </span>
                </div>

                <div className="order-history-actions">
                  <span className="badge">{order.status}</span>
                  <span className="badge">Payment: {order.paymentStatus}</span>

                  <button
                    className="light-button"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    {isCancelled ? "View Details" : "Track Order"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;
