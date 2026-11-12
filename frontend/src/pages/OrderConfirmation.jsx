import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import { getOrderById } from "../services/api";

function OrderConfirmation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!id) {
          throw new Error("Order ID is missing.");
        }

        const response = await getOrderById(id);

        console.log("Order API Response:", response);

        // Your backend returns { success: true, data: {...} }
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to load order:", err);
        setError(err.message || "Unable to load order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container">
        <p>{error || "Order not found."}</p>

        <button
          className="light-button"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }
  const subtotal = Number(order.subtotal || 0);
  const deliveryFee = Number(order.deliveryFee || 0);
  const discount = Number(order.discount || 0);
  const totalAmount = Number(order.totalAmount || 0);

  const createdDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "Date unavailable";

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully</h1>
          <p>
            Order Number: <strong>{order.id}</strong> {" . "} Placed on {createdDate}
          </p>
        </div>

        <div className="confirmation-card">
          <div className="status-badges">
            <span className="badge green-badge">{order.status || "ORDER_PLACED"}</span>
            <span className="badge">
              Cash on Delivery
            </span>
            {/* <span className="badge"> {order.payment || "Cash on Delivery"}</span> */}
            <span className="badge">
              Payment: {order.paymentStatus || "Pending"}
            </span>
          </div>
          <p>
            <strong>Customer:</strong>{" "}
            {order.user?.userName ||
              order.deliveryFullName ||
              "Customer"}
          </p>

          <table className="confirmation-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => {
                const price = Number(item.price || 0);
                const quantity = Number(item.quantity || 0);

                return (
                  <tr key={item.id}>
                    <td>
                      {item.product?.name || "Product"}
                    </td>

                    <td>{quantity}</td>

                    <td>
                      Rs. {(price * quantity).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="confirmation-prices">
            <div>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div>
              <span>Delivery Fee</span>
              <span>Rs. {deliveryFee.toLocaleString()}</span>
            </div>
            <div>
              <span>Discount</span>
              <span>
                {discount > 0
                  ? `- Rs. ${discount.toLocaleString()}`
                  : "—"}
              </span>
            </div>
            <div className="confirmation-total">
              <strong>Total Amount</strong>
              <strong>Rs. {totalAmount.toLocaleString()}</strong>
            </div>
          </div>

          <div className="payment-info">
            Payment will be collected on delivery.
          </div>

          <p className="deliver-text">
            <strong>Deliver to:</strong>{" "}
            {order.deliveryFullName}
            {order.deliveryAddress && `, ${order.deliveryAddress}`}
            {order.area && `, ${order.area}`}
          </p>
        </div>

        <div className="confirmation-buttons">

          <button
            className="light-button large-button"
            onClick={() => navigate("/orders")}
          >
            Order History
          </button>

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
