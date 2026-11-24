// import { useState } from "react";
// import DeliveryStats from "../../components/Delivery/DeliveryStats";
// import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
// import DeliveryOrderDetails from "../../components/Delivery/DeliveryOrderDetails";

// function Dashboard({ orders, saveOrders, showCompleted = false, agentId }) {
//   const [tab, setTab] = useState(showCompleted ? "Delivered" : "All");
//   const [selected, setSelected] = useState(null);
//   const [toast, setToast] = useState("");

// const [showReasonForm, setShowReasonForm] = useState(false);
// const [pendingOrderId, setPendingOrderId] = useState(null);
// const [failureReason, setFailureReason] = useState("");
// const [failureNote, setFailureNote] = useState("");


//   const filtered = orders.filter((order) => {
//     if (showCompleted) {
//       return order.status === "DELIVERED";
//     }

//     return (
//       tab === "All" ||
//       (tab === "Active"
//          ? !["DELIVERED", "DELIVERY_FAILED", "CANCELLED"].includes(order.status)
//       : order.status === tab)
//     );
//   });



// // const updateStatus = (orderId, newStatus, failureDetails = {}) => {
// //   const updatedOrders = orders.map((order) =>
// //     order.id === orderId
// //       ? {
// //           ...order,
// //           ...failureDetails,
// //           status: newStatus,
// //         }
// //       : order
// //   );

// //   saveOrders(updatedOrders);

// //   const updatedSelected = updatedOrders.find(
// //     (order) => order.id === orderId
// //   );

// //   setSelected(updatedSelected);
// //   setToast("Order status updated");

// //   setTimeout(() => setToast(""), 2200);
// // };
// const updateStatus = (orderId, newStatus) => {
//   if (newStatus === "DELIVERY_FAILED") {
//     setPendingOrderId(orderId);
//     setFailureReason("");
//     setFailureNote("");
//     setShowReasonForm(true);
//     return;
//   }

// };

// const saveDeliveryFailure = () => {
//   if (!failureReason) {
//     setToast("Please select a reason");
//     return;
//   }

//   const updatedOrders = orders.map((order) =>
//     order.id === pendingOrderId
//       ? {
//           ...order,
//           status: "DELIVERY_FAILED",
//           deliveryFailureReason: failureReason,
//           deliveryFailureNote: failureNote,
//           deliveryFailedAt: new Date().toISOString(),
//         }
//       : order
//   );

//   saveOrders(updatedOrders);

//   const updatedSelected = updatedOrders.find(
//     (order) => order.id === pendingOrderId
//   );

//   setSelected(updatedSelected);
//   setShowReasonForm(false);
//   setPendingOrderId(null);

//   setToast("Delivery failure reason saved");

//   setTimeout(() => setToast(""), 2200);
// };



//   return (
//     <section className="content">
//       <div className="eyebrow">
//         DELIVERY PARTNER WORKSPACE
//       </div>

//       <div className="row">
//         <div>
//           <h1 className="heading">
//             Good day, {agentId} 👋
//           </h1>

//           <p className="sub">
//             {showCompleted
//               ? "Here are your completed deliveries."
//               : "Here are your delivery assignments for today."}
//           </p>
//         </div>

//         <span className="pill">
//           ● Available for deliveries
//         </span>
//       </div>

//       {!showCompleted && <DeliveryStats orders={orders} />}

//       <div className="grid2">
//         <div className="panel">
//           <div className="panelhead">
//             <h3>
//               {showCompleted ? "Completed deliveries" : "Delivery queue"}
//             </h3>

//             {!showCompleted && (
//               <select
//                 className="field"
//                 value={tab}
//                 onChange={(e) => {
//                   setTab(e.target.value);
//                   setSelected(null);
//                 }}
//               >
//                 <option value="All">All</option>
//                 <option value="Active">Active</option>
//                 <option value="DELIVERED">Delivered</option>
//                 <option value="DELIVERY_FAILED">Not Delivered</option>
//               </select>
//             )}
//           </div>

//           {filtered.map((order) => (
//             <DeliveryOrderCard
//               key={order.id}
//               order={order}
//               selected={selected?.id === order.id}
//               onSelect={setSelected}
//             />
//           ))}

//           {!filtered.length && (
//             <div className="empty">
//               No deliveries in this list.
//             </div>
//           )}
//         </div>

//         <div className="panel">
//           <DeliveryOrderDetails
//             order={selected}
//             onStatusChange={updateStatus}
//           />
//         </div>
//       </div>

//       {!showCompleted && (
//         <div className="panel">
//           <div className="panelhead">
//             <h3>Delivery checklist</h3>
//             <span className="muted">
//               A smooth delivery, every time
//             </span>
//           </div>

//           <div className="quickgrid">
//             {[
//               ["01", "Check the order", "Confirm every item before leaving."],
//               ["02", "Contact the customer", "Call if you need help finding the address."],
//               ["03", "Collect payment", "Collect the COD amount and confirm delivery."],
//             ].map(([number, title, description]) => (
//               <div className="quick" key={number}>
//                 <span className="pill">{number}</span>
//                 <b>{title}</b>
//                 <small>{description}</small>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}


// {showReasonForm && (
//   <div className="panel">
//     <div className="panelhead">
//       <h3>Why couldn't you deliver this order?</h3>
//     </div>

//     <p className="sub">
//       Please select a reason. The owner and customer
//       will be able to see this information.
//     </p>

//     <select
//       className="field"
//       value={failureReason}
//       onChange={(e) => setFailureReason(e.target.value)}
//     >
//       <option value="">Select a reason</option>
//       <option value="Customer unavailable">
//         Customer unavailable
//       </option>
//       <option value="Customer phone not reachable">
//         Customer phone not reachable
//       </option>
//       <option value="Incorrect delivery address">
//         Incorrect delivery address
//       </option>
//       <option value="Customer cancelled the order">
//         Customer cancelled the order
//       </option>
//       <option value="Customer refused to accept the order">
//         Customer refused to accept the order
//       </option>
//       <option value="Other">
//         Other
//       </option>
//     </select>

//     <textarea
//       className="field"
//       placeholder="Additional details (optional)"
//       value={failureNote}
//       onChange={(e) => setFailureNote(e.target.value)}
//       rows="3"
//     />

//     <div className="confirmation-buttons">
//       <button
//         className="white-button"
//         onClick={() => setShowReasonForm(false)}
//       >
//         Cancel
//       </button>

//       <button
//         className="green-button"
//         onClick={saveDeliveryFailure}
//       >
//         Submit reason
//       </button>
//     </div>
//   </div>
// )}


//       {toast && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: 25,
//             right: 25,
//             background: "#173c2b",
//             color: "white",
//             padding: "13px 18px",
//             borderRadius: 10,
//             fontSize: 12,
//           }}
//         >
//           {toast}
//         </div>
//       )}
//     </section>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import DeliveryStats from "../../components/Delivery/DeliveryStats";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import DeliveryOrderDetails from "../../components/Delivery/DeliveryOrderDetails";
import {
  getOrders,
  updateOrderStatus,
} from "../../services/api";

function Dashboard({
  showCompleted = false,
  agentId = "Delivery Agent",
}) {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(showCompleted ? "DELIVERED" : "All");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Convert backend order data into the format used by our UI
  const formatOrder = (order) => ({
    ...order,
    id: order.id,
    customer: order.deliveryFullName || "Customer",
    phone: order.phoneNumber || "N/A",
    address: order.deliveryAddress || "N/A",
    area: order.area || "N/A",
    note: order.deliveryNote || "",
    total: Number(order.totalAmount || 0),
    time: order.createdAt
      ? new Date(order.createdAt).toLocaleString()
      : "N/A",
    items: (order.items || []).map((item) => ({
      ...item,
      name: item.product?.name || "Product",
      quantity: Number(item.quantity),
    })),
  });

  // Fetch orders from the backend
  const loadOrders = async () => {
    try {
      setError("");

      const result = await getOrders();

      const orderList = Array.isArray(result.data)
        ? result.data.map(formatOrder)
        : [];

      setOrders(orderList);

      // Keep the selected order updated after refreshing
      setSelected((currentSelected) => {
        if (!currentSelected) return null;

        return (
          orderList.find(
            (order) => order.id === currentSelected.id
          ) || null
        );
      });
    } catch (err) {
      setError(err.message || "Failed to load deliveries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update order status in the database
  const updateStatus = async (
    orderId,
    newStatus,
    failureDetails = {}
  ) => {
    const statusMap = {
      "Assigned": "ASSIGNED",
      "Picked up": "PICKED_UP",
      "On the way": "OUT_FOR_DELIVERY",
      "Delivered": "DELIVERED",
      "Not Delivered": "DELIVERY_FAILED",
    };

    const status = statusMap[newStatus] || newStatus;

    try {
      setUpdating(true);
      setToast("");

      await updateOrderStatus(
        orderId,
        status,
        {
          deliveryFailureReason:
            failureDetails.deliveryFailureReason,
          deliveryFailureNote:
            failureDetails.deliveryFailureNote,
        }
      );

      await loadOrders();

      setToast("Order status updated successfully.");

      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      setToast(
        err.message || "Could not update order status."
      );

      setTimeout(() => setToast(""), 3500);
    } finally {
      setUpdating(false);
    }
  };

  // Filter orders
  const filtered = orders.filter((order) => {
    if (showCompleted) {
      return order.status === "DELIVERED";
    }

    return (
      tab === "All" ||
      (
        tab === "Active"
          ? ![
            "DELIVERED",
            "DELIVERY_FAILED",
            "CANCELLED",
          ].includes(order.status)
          : order.status === tab
      )
    );
  });

  return (
    <section className="content">
      <div className="eyebrow">
        DELIVERY PARTNER WORKSPACE
      </div>

      <div className="row">
        <div>
          <h1 className="heading">
            Good day, {agentId} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-face-slightly-smiling preview-icon"><path d="M15 10V9"/><path d="M16.472 15a6 6 0 01-8.943 0"/><path d="M9 10V9"/><circle cx="12" cy="12" r="10"/></svg>
          </h1>

          <p className="sub">
            {showCompleted
              ? "Here are your completed deliveries."
              : "Here are your delivery assignments for today."}
          </p>
        </div>

        <span className="pill">
          Available for deliveries
        </span>
      </div>

      {!showCompleted && (
        <DeliveryStats orders={orders} />
      )}

      {loading ? (
        <div className="panel">
          Loading your deliveries...
        </div>
      ) : error ? (
        <div className="panel">
          <div className="empty">
            <div style={{ fontSize: 35, marginBottom: 12 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag preview-icon"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/></svg>
            </div>

            <h3>Unable to load deliveries</h3>

            <p className="muted">
              We couldn't retrieve your delivery assignments.
              Please try again later.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid2">
            <div className="panel">
              <div className="panelhead">
                <h3>
                  {showCompleted
                    ? "Completed deliveries"
                    : "Delivery queue"}
                </h3>

                {!showCompleted && (
                  <select
                    className="field"
                    value={tab}
                    onChange={(e) => {
                      setTab(e.target.value);
                      setSelected(null);
                    }}
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="DELIVERY_FAILED">
                      Not Delivered
                    </option>
                  </select>
                )}
              </div>

              {filtered.map((order) => (
                <DeliveryOrderCard
                  key={order.id}
                  order={order}
                  selected={selected?.id === order.id}
                  onSelect={setSelected}
                />
              ))}

              {!filtered.length && (
                <div className="empty">
                  <div style={{ fontSize: 35, marginBottom: 12 }}>
                    {showCompleted ? <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box preview-icon"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-truck preview-icon"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>}
                  </div>

                  <h3>
                    {showCompleted
                      ? "No completed deliveries yet"
                      : orders.length === 0
                        ? "No deliveries assigned yet"
                        : "No deliveries in this list"}
                  </h3>

                  <p className="muted">
                    {showCompleted
                      ? "Your completed orders will appear here."
                      : orders.length === 0
                        ? "When the owner assigns an order to you, it will appear here."
                        : "There are no orders matching this filter."}
                  </p>
                </div>
              )}
            </div>

            <div className="panel">
              <DeliveryOrderDetails
                order={selected}
                onStatusChange={updateStatus}
                updating={updating}
              />
            </div>
          </div>

          {!showCompleted && (
            <div className="panel">
              <div className="panelhead">
                <h3>Delivery checklist</h3>
                <span className="muted">
                  A smooth delivery, every time
                </span>
              </div>

              <div className="quickgrid">
                {[
                  [
                    "01",
                    "Check the order",
                    "Confirm every item before leaving.",
                  ],
                  [
                    "02",
                    "Contact the customer",
                    "Call if you need help finding the address.",
                  ],
                  [
                    "03",
                    "Collect payment",
                    "Collect the COD amount and confirm delivery.",
                  ],
                ].map(([number, title, description]) => (
                  <div className="quick" key={number}>
                    <span className="pill">
                      {number}
                    </span>
                    <b>{title}</b>
                    <small>{description}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 25,
            right: 25,
            background: "#173c2b",
            color: "white",
            padding: "13px 18px",
            borderRadius: 10,
            fontSize: 12,
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
