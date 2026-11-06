import React from "react";
import { useNavigate } from "react-router-dom";
import "../layouts/IsumiMartOrders.css";

const OrderHistory = ({ orders = [] }) => {
  const navigate = useNavigate();

  const formatMoney = (amount) =>
    `LKR ${Number(amount || 0).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="page-container">
      <main className="main-content">

        <h1 className="page-title">Your orders</h1>

        <p className="page-subtitle">
          All your neighborhood grocery runs, in one place.
        </p>

        <div className="orders-card">
          <h2 className="card-title">Current & past orders</h2>

          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Placed on</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Order status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const failed = order.status === "Not Delivered";

                const itemCount = Array.isArray(order.items)
                  ? order.items.reduce(
                      (total, item) =>
                        total + Number(item.quantity || 1),
                      0
                    )
                  : order.items || "-";

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className={
                        failed || order.status === "Cancelled"
                          ? "row-cancelled"
                          : ""
                      }
                    >
                      <td className="order-id">{order.id}</td>

                      <td>{order.date || "-"}</td>

                      <td>
                        {typeof itemCount === "number"
                          ? `${itemCount} items`
                          : itemCount}
                      </td>

                      <td>{formatMoney(order.total)}</td>

                      <td>
                        <span
                          className={`badge-payment ${
                            (order.payment || "Pending").toLowerCase()
                          }`}
                        >
                          {order.payment || "Pending"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge-status ${order.status
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="action-btn"
                          onClick={() =>
                            navigate(`/orders/${order.id}`)
                          }
                        >
                          View details →
                        </button>
                      </td>
                    </tr>

                    {/* Delivery failure information */}
                    {failed && (
                      <tr className="note-row">
                        <td colSpan="7" className="cancelled-note">
                          <strong>Delivery Unsuccessful</strong>

                          <p>
                            Reason:{" "}
                            {order.deliveryFailureReason ||
                              "No reason provided"}
                          </p>

                          {order.deliveryFailureNote && (
                            <p>
                              Additional details:{" "}
                              {order.deliveryFailureNote}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}

                    {order.status === "Cancelled" && (
                      <tr className="note-row">
                        <td colSpan="7" className="cancelled-note">
                          This order has been cancelled.
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {!orders.length && (
                <tr>
                  <td colSpan="7" className="empty">
                    You haven't placed any orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="results-count">
            Showing {orders.length} orders
          </span>

          <button
            className="back-btn"
            onClick={() => navigate("/products")}
          >
            Back to shopping
          </button>
        </div>

      </main>
    </div>
  );
};

export default OrderHistory;