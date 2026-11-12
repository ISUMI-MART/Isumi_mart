
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/api";
import "../layouts/TrackOrder.css";


function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err) {
        setError(err.message || "Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Unable to load order</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/orders")}>
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="track-order-container">
      <h1>Order Details</h1>

      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Customer:</strong> {order.deliveryFullName}</p>
      <p><strong>Address:</strong> {order.deliveryAddress}</p>
      <p><strong>Area:</strong> {order.area}</p>
      <p><strong>Phone:</strong> {order.phoneNumber}</p>

      <p>
        <strong>Order Status:</strong> {order.status}
      </p>

      <p>
        <strong>Payment Status:</strong> {order.paymentStatus}
      </p>

      <h2>Ordered Items</h2>

      {order.items?.length > 0 ? (
        order.items.map((item) => (
          <div key={item.id}>
            <p>Product: {item.product?.name || "Product"}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: Rs. {Number(item.price).toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p>No items found.</p>
      )}

      <h2>Payment Summary</h2>

      <p>Subtotal: Rs. {Number(order.subtotal).toFixed(2)}</p>
      <p>Delivery Fee: Rs. {Number(order.deliveryFee).toFixed(2)}</p>
      <p>Discount: Rs. {Number(order.discount).toFixed(2)}</p>

      <h3>
        Total: Rs. {Number(order.totalAmount).toFixed(2)}
      </h3>

      <button
        className="light-button"
        onClick={() => navigate("/orders")}
      >
        Back to Orders
      </button>
    </div>
  );
}

export default TrackOrder;
