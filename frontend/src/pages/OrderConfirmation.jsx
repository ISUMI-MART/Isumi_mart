import React from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { formatAddress, getStoredOrders } from "../data/orders";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the order passed from CheckoutSummary
  let order = location.state?.order ?? null;

  // If it was not passed, read it from localStorage
  if (!order) {
    try {
      order = JSON.parse(localStorage.getItem("latestOrder"));
    } catch {
      order = null;
    }
  }

  // Final fallback: use the newest saved order
  if (!order) {
    const savedOrders = getStoredOrders();

    if (savedOrders.length > 0) {
      order = savedOrders[savedOrders.length - 1];
    }
  }

  if (!order) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully</h1>
          <p>
            Order Number: <strong>{order.id}</strong> · Placed on {order.date}
          </p>
        </div>

        <div className="confirmation-card">
          <div className="status-badges">
            <span className="badge green-badge">{order.status}</span>
            <span className="badge">
              {order.payment || "Cash on Delivery"}
            </span>
            <span className="badge">
              Payment: {order.paymentStatus || "Pending"}
            </span>
          </div>

          <table className="confirmation-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="confirmation-prices">
            <div>
              <span>Subtotal</span>
              <span>Rs. {(order.subtotal ?? 0).toLocaleString()}</span>
            </div>
            <div>
              <span>Delivery Fee</span>
              <span>Rs. {(order.deliveryFee ?? 0).toLocaleString()}</span>
            </div>
            <div>
              <span>Discount</span>
              <span>
                {order.discount > 0
                  ? `- Rs. ${order.discount.toLocaleString()}`
                  : "—"}
              </span>
            </div>
            <div className="confirmation-total">
              <strong>Total Amount</strong>
              <strong>Rs. {(order.total ?? 0).toLocaleString()}</strong>
            </div>
          </div>

          <div className="payment-info">
            Payment will be collected on delivery.
          </div>

          <p className="deliver-text">
            Deliver to: {formatAddress(order.address)}
          </p>
        </div>

        <div className="confirmation-buttons">
          <button
            className="green-button"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            Track Order
          </button>

          {/* <button
            className="light-button large-button"
            onClick={() => navigate("/orders")}
          >
            Order History
          </button> */}

          <button
            className="light-button large-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
