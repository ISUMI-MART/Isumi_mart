// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../layouts/IsumiMartOrders.css";

// const OrderHistory = ({ orders = [] }) => {
//   const navigate = useNavigate();

//   const formatMoney = (amount) =>
//     `LKR ${Number(amount || 0).toLocaleString("en-LK", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   return (
//     <div className="page-container">
//       <main className="main-content">

//         <h1 className="page-title">Your orders</h1>

//         <p className="page-subtitle">
//           All your neighborhood grocery runs, in one place.
//         </p>

//         <div className="orders-card">
//           <h2 className="card-title">Current & past orders</h2>

//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order</th>
//                 <th>Placed on</th>
//                 <th>Items</th>
//                 <th>Total</th>
//                 <th>Payment</th>
//                 <th>Order status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.map((order) => {
//                 const failed = order.status === "Not Delivered";

//                 const itemCount = Array.isArray(order.items)
//                   ? order.items.reduce(
//                       (total, item) =>
//                         total + Number(item.quantity || 1),
//                       0
//                     )
//                   : order.items || "-";

//                 return (
//                   <React.Fragment key={order.id}>
//                     <tr
//                       className={
//                         failed || order.status === "Cancelled"
//                           ? "row-cancelled"
//                           : ""
//                       }
//                     >
//                       <td className="order-id">{order.id}</td>

//                       <td>{order.date || "-"}</td>

//                       <td>
//                         {typeof itemCount === "number"
//                           ? `${itemCount} items`
//                           : itemCount}
//                       </td>

//                       <td>{formatMoney(order.total)}</td>

//                       <td>
//                         <span
//                           className={`badge-payment ${
//                             (order.payment || "Pending").toLowerCase()
//                           }`}
//                         >
//                           {order.payment || "Pending"}
//                         </span>
//                       </td>

//                       <td>
//                         <span
//                           className={`badge-status ${order.status
//                             ?.toLowerCase()
//                             .replace(/\s+/g, "-")}`}
//                         >
//                           {order.status}
//                         </span>
//                       </td>

//                       <td>
//                         <button
//                           className="action-btn"
//                           onClick={() =>
//                             navigate(`/orders/${order.id}`)
//                           }
//                         >
//                           View details →
//                         </button>
//                       </td>
//                     </tr>

//                     {/* Delivery failure information */}
//                     {failed && (
//                       <tr className="note-row">
//                         <td colSpan="7" className="cancelled-note">
//                           <strong>Delivery Unsuccessful</strong>

//                           <p>
//                             Reason:{" "}
//                             {order.deliveryFailureReason ||
//                               "No reason provided"}
//                           </p>

//                           {order.deliveryFailureNote && (
//                             <p>
//                               Additional details:{" "}
//                               {order.deliveryFailureNote}
//                             </p>
//                           )}
//                         </td>
//                       </tr>
//                     )}

//                     {order.status === "Cancelled" && (
//                       <tr className="note-row">
//                         <td colSpan="7" className="cancelled-note">
//                           This order has been cancelled.
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 );
//               })}

//               {!orders.length && (
//                 <tr>
//                   <td colSpan="7" className="empty">
//                     You haven't placed any orders yet.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="table-footer">
//           <span className="results-count">
//             Showing {orders.length} orders
//           </span>

//           <button
//             className="back-btn"
//             onClick={() => navigate("/products")}
//           >
//             Back to shopping
//           </button>
//         </div>

//       </main>
//     </div>
//   );
// };

// export default OrderHistory;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/api";
import "../layouts/IsumiMartOrders.css";

const OrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customer orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        // Handle common backend response structures
        const orderList = Array.isArray(response.data)
          ? response.data
          : response.data?.orders ||
            response.orders ||
            [];

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
      <div className="page-container">
        <main className="main-content">
          <h2>Unable to load orders</h2>
          <p>{error}</p>

          <button
            className="back-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
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
                const failed =
                  order.status === "Not Delivered" ||
                  order.status === "DELIVERY_FAILED";

                const cancelled =
                  order.status === "Cancelled" ||
                  order.status === "CANCELLED";

                const itemCount = Array.isArray(order.items)
                  ? order.items.reduce(
                      (total, item) =>
                        total + Number(item.quantity || 1),
                      0
                    )
                  : "-";

                const payment =
                  order.paymentStatus || order.payment || "Pending";

                const total =
                  order.totalAmount ?? order.total ?? 0;

                const date =
                  order.createdAt || order.date;

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className={
                        failed || cancelled
                          ? "row-cancelled"
                          : ""
                      }
                    >
                      <td className="order-id">
                        {order.id}
                      </td>

                      <td>
                        {date
                          ? new Date(date).toLocaleDateString("en-LK")
                          : "-"}
                      </td>

                      <td>
                        {typeof itemCount === "number"
                          ? `${itemCount} items`
                          : itemCount}
                      </td>

                      <td>{formatMoney(total)}</td>

                      <td>
                        <span
                          className={`badge-payment ${payment.toLowerCase()}`}
                        >
                          {payment}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge-status ${order.status
                            ?.toLowerCase()
                            .replace(/_/g, "-")
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

                    {cancelled && (
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
