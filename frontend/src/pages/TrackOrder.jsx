import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getOrderById, formatAddress } from "../data/orders";

const STEPS = ["Order Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // TODO (backend): replace with GET /api/orders/:orderId
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="track-order-page">
        <div className="track-container">
          <h1>Order not found</h1>
          <p className="placed-date">We could not find an order called {orderId}.</p>
          <Link to="/orders" className="light-button">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled";
  const isPaid = order.paymentStatus === "Paid";
  const currentStep = STEPS.indexOf(order.status);
  const address = typeof order.address === "string" ? { street: order.address } : order.address || {};

  return (
    <div className="track-order-page">
      <div className="track-container">
        <h1>Order {order.id}</h1>
        <p className="placed-date">Placed on {order.date}</p>

        <div className="status-badges">
          <span className="badge green-badge">{order.status}</span>
          <span className="badge">Payment: {order.paymentStatus}</span>
          <span className="badge">Cash on Delivery</span>
        </div>

        {isCancelled ? (
          <div className="tracking-card cancelled-card">
            <strong>This order was cancelled.</strong>
            <span>No payment is due. Please place a new order if needed.</span>
          </div>
        ) : (
          <div className="tracking-card">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={index <= currentStep ? "tracking-step active" : "tracking-step"}
              >
                <div className="step-number">{index + 1}</div>
                {index === currentStep ? <strong>{step}</strong> : <span>{step}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="track-layout">
          <div className="track-order-card">
            <table className="confirmation-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="confirmation-prices">
              <div><span>Subtotal</span><span>Rs. {order.subtotal.toLocaleString()}</span></div>
              <div><span>Delivery Fee</span><span>Rs. {order.deliveryFee.toLocaleString()}</span></div>
              <div>
                <span>Discount</span>
                <span>{order.discount > 0 ? `- Rs. ${order.discount.toLocaleString()}` : "—"}</span>
              </div>
              <div className="confirmation-total">
                <strong>Total Amount</strong>
                <strong>Rs. {order.total.toLocaleString()}</strong>
              </div>
            </div>

            <div className="payment-info">
              {isPaid
                ? `Payment received on delivery: Rs. ${order.total.toLocaleString()}`
                : "Payment will be collected on delivery."}
            </div>
          </div>

          <div className="delivery-card">
            <h2>Delivery</h2>
            <p>{formatAddress(order.address)}</p>
            <p>Phone: {address.phone || "—"}</p>
            <p>Agent: {order.agent || "Not assigned yet"}</p>

            <button className="light-button full-button" onClick={() => navigate("/orders")}>
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackOrder;
