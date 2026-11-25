import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";
import "../layouts/IsumiMartOrders.css";

const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch customer orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        const orderList = Array.isArray(response.data)
          ? response.data
          : response.data?.orders || response.orders || [];

        setOrders(orderList);
      } catch (err) {
        setError(err.message || "Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatMoney = (amount) =>
    `LKR ${Number(amount || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <main className="main-content">
          <p>Loading your orders...</p>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container" >
        <main className="main-content"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "12px",
    }}>
          <h2>PLEASE LOG IN TO LOAD ORDERS</h2>
          <button className="back-btn" onClick={() => navigate("/login")} style={{background:"red",color:"white"}}>
           LOGIN
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">Your orders</h1>

        <p className="page-subtitle">
          All your neighborhood grocery runs, in one place.
        </p>

        <div className="orders-card">
          <h2 className="card-title">Current & past orders</h2>

          {!orders.length && (
            <div className="orders-empty">
              You haven't placed any orders yet.
            </div>
          )}

          <div className="orders-list">
            {currentOrders.map((order) => {
              const failed =
                order.status === "Not Delivered" ||
                order.status === "DELIVERY_FAILED";

              const cancelled =
                order.status === "Cancelled" || order.status === "CANCELLED";

              const itemCount = Array.isArray(order.items)
                ? order.items.length
                : "-";

              const payment = order.paymentStatus || order.payment || "Pending";

              const total = order.totalAmount ?? order.total ?? 0;
              const date = order.createdAt || order.date;

              return (
                <article
                  key={order.id}
                  className={`order-card ${
                    failed || cancelled ? "order-card-alert" : ""
                  }`}
                >
                  <div className="order-card-top">
                    <div>
                      <span className="order-label">Order</span>
                      <h3 className="order-id">{order.id}</h3>
                    </div>

                    <span
                      className={`badge-status ${order.status
                        ?.toLowerCase()
                        .replace(/_/g, "-")
                        .replace(/\s+/g, "-")}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-details">
                    <div className="order-detail">
                      <span className="order-label">Placed on</span>
                      <strong>
                        {date
                          ? new Date(date).toLocaleDateString("en-LK")
                          : "-"}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span className="order-label">Items</span>
                      <strong>
                        {typeof itemCount === "number"
                          ? `${itemCount} items`
                          : itemCount}
                      </strong>
                    </div>

                    <div className="order-detail">
                      <span className="order-label">Total</span>
                      <strong>{formatMoney(total)}</strong>
                    </div>

                    <div className="order-detail">
                      <span className="order-label">Payment</span>
                      <span
                        className={`badge-payment ${payment.toLowerCase()}`}
                      >
                        {payment}
                      </span>
                    </div>
                  </div>

                  {failed && (
                    <div className="cancelled-note">
                      <strong>Delivery Unsuccessful</strong>

                      <p>
                        Reason:{" "}
                        {order.deliveryFailureReason || "No reason provided"}
                      </p>

                      {order.deliveryFailureNote && (
                        <p>Additional details: {order.deliveryFailureNote}</p>
                      )}
                    </div>
                  )}

                  {cancelled && (
                    <div className="cancelled-note">
                      This order has been cancelled.
                    </div>
                  )}

                  <button
                    className="action-btn"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View details →
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <div className="table-footer">
          <span className="results-count">
            Showing {orders.length === 0 ? 0 : indexOfFirstOrder + 1}-
            {Math.min(indexOfLastOrder, orders.length)} of {orders.length}{" "}
            orders
          </span>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-btn ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}

              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}

          <button className="back-btn" onClick={() => navigate("/products")}>
            Back to shopping
          </button>
        </div>
      </main>
    </div>
  );
};

export default OrderHistory;
