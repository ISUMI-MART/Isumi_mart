import { useState } from "react";
import DeliveryStats from "../../components/Delivery/DeliveryStats";
import DeliveryOrderCard from "../../components/Delivery/DeliveryOrderCard";
import DeliveryOrderDetails from "../../components/Delivery/DeliveryOrderDetails";

function Dashboard({ orders, saveOrders, showCompleted = false, agentId }) {
  const [tab, setTab] = useState(showCompleted ? "Delivered" : "All");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  
const [showReasonForm, setShowReasonForm] = useState(false);
const [pendingOrderId, setPendingOrderId] = useState(null);
const [failureReason, setFailureReason] = useState("");
const [failureNote, setFailureNote] = useState("");


  const filtered = orders.filter((order) => {
    if (showCompleted) {
      return order.status === "Delivered";
    }

    return (
      tab === "All" ||
      (tab === "Active"
        ? order.status !== "Delivered"
        : order.status === tab)
    );
  });



const updateStatus = (orderId, newStatus, failureDetails = {}) => {
  const updatedOrders = orders.map((order) =>
    order.id === orderId
      ? {
          ...order,
          ...failureDetails,
          status: newStatus,
        }
      : order
  );

  saveOrders(updatedOrders);

  const updatedSelected = updatedOrders.find(
    (order) => order.id === orderId
  );

  setSelected(updatedSelected);
  setToast("Order status updated");

  setTimeout(() => setToast(""), 2200);
};

const saveDeliveryFailure = () => {
  if (!failureReason) {
    setToast("Please select a reason");
    return;
  }

  const updatedOrders = orders.map((order) =>
    order.id === pendingOrderId
      ? {
          ...order,
          status: "Not Delivered",
          deliveryFailureReason: failureReason,
          deliveryFailureNote: failureNote,
          deliveryFailedAt: new Date().toISOString(),
        }
      : order
  );

  saveOrders(updatedOrders);

  const updatedSelected = updatedOrders.find(
    (order) => order.id === pendingOrderId
  );

  setSelected(updatedSelected);
  setShowReasonForm(false);
  setPendingOrderId(null);

  setToast("Delivery failure reason saved");

  setTimeout(() => setToast(""), 2200);
};



  return (
    <section className="content">
      <div className="eyebrow">
        DELIVERY PARTNER WORKSPACE
      </div>

      <div className="row">
        <div>
          <h1 className="heading">
            Good day, {agentId} 👋
          </h1>

          <p className="sub">
            {showCompleted
              ? "Here are your completed deliveries."
              : "Here are your delivery assignments for today."}
          </p>
        </div>

        <span className="pill">
          ● Available for deliveries
        </span>
      </div>

      {!showCompleted && <DeliveryStats orders={orders} />}

      <div className="grid2">
        <div className="panel">
          <div className="panelhead">
            <h3>
              {showCompleted ? "Completed deliveries" : "Delivery queue"}
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
                <option value="Delivered">Delivered</option>
                <option value="Not Delivered">Not Delivered</option>
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
              No deliveries in this list.
            </div>
          )}
        </div>

        <div className="panel">
          <DeliveryOrderDetails
            order={selected}
            onStatusChange={updateStatus}
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
              ["01", "Check the order", "Confirm every item before leaving."],
              ["02", "Contact the customer", "Call if you need help finding the address."],
              ["03", "Collect payment", "Collect the COD amount and confirm delivery."],
            ].map(([number, title, description]) => (
              <div className="quick" key={number}>
                <span className="pill">{number}</span>
                <b>{title}</b>
                <small>{description}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      
{showReasonForm && (
  <div className="panel">
    <div className="panelhead">
      <h3>Why couldn't you deliver this order?</h3>
    </div>

    <p className="sub">
      Please select a reason. The owner and customer
      will be able to see this information.
    </p>

    <select
      className="field"
      value={failureReason}
      onChange={(e) => setFailureReason(e.target.value)}
    >
      <option value="">Select a reason</option>
      <option value="Customer unavailable">
        Customer unavailable
      </option>
      <option value="Customer phone not reachable">
        Customer phone not reachable
      </option>
      <option value="Incorrect delivery address">
        Incorrect delivery address
      </option>
      <option value="Customer cancelled the order">
        Customer cancelled the order
      </option>
      <option value="Customer refused to accept the order">
        Customer refused to accept the order
      </option>
      <option value="Other">
        Other
      </option>
    </select>

    <textarea
      className="field"
      placeholder="Additional details (optional)"
      value={failureNote}
      onChange={(e) => setFailureNote(e.target.value)}
      rows="3"
    />

    <div className="confirmation-buttons">
      <button
        className="white-button"
        onClick={() => setShowReasonForm(false)}
      >
        Cancel
      </button>

      <button
        className="green-button"
        onClick={saveDeliveryFailure}
      >
        Submit reason
      </button>
    </div>
  </div>
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
          }}
        >
          {toast}
        </div>
      )}
    </section>
  );
}

export default Dashboard;