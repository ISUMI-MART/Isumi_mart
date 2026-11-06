
import { useState } from "react";
import { money } from "../../data/deliveryData";

function DeliveryOrderDetails({ order, onStatusChange }) {
  const [failureReason, setFailureReason] = useState("");
  const [failureNote, setFailureNote] = useState("");
  const [showReasonForm, setShowReasonForm] = useState(false);

  if (!order) {
    return (
      <div className="empty" style={{ padding: "65px 15px" }}>
        <div style={{ fontSize: 35, marginBottom: 12 }}>🛵</div>
        <b style={{ color: "#405047" }}>Select a delivery</b>
        <p>
          Choose an order from your queue to view its details
          and update its status.
        </p>
      </div>
    );
  }

  const handleStatusChange = (status) => {
    if (status === "Not Delivered") {
      setFailureReason("");
      setFailureNote("");
      setShowReasonForm(true);
      return;
    }

    setShowReasonForm(false);
    onStatusChange(order.id, status);
  };

  const submitFailureReason = () => {
    if (!failureReason) {
      alert("Please select a reason.");
      return;
    }

    onStatusChange(order.id, "Not Delivered", {
      deliveryFailureReason: failureReason,
      deliveryFailureNote: failureNote,
      deliveryFailedAt: new Date().toISOString(),
    });

    setShowReasonForm(false);
  };

  return (
    <>
      <div className="panelhead">
        <h3>Delivery details</h3>
        <span className="pill blue">{order.id}</span>
      </div>

      <h2 style={{ font: "800 18px Manrope", margin: "8px 0" }}>
        {order.customer}
      </h2>

      <p className="muted">CUSTOMER</p>
      <p style={{ fontSize: 13 }}>☎ {order.phone}</p>
      <p style={{ fontSize: 13 }}>⌖ {order.address}</p>

      <div style={{ height: 1, background: "#edf1ed", margin: "17px 0" }} />

      <h3>Order items</h3>

      {order.items.map((item, index) => (
        <div
          key={index}
          className="row"
          style={{
            padding: "10px 0",
            borderBottom: "1px solid #f0f3f0",
          }}
        >
          <span style={{ fontSize: 12 }}>
            {typeof item === "string"
              ? item
              : `${item.name} × ${item.quantity}`}
          </span>
        </div>
      ))}

      <div className="row" style={{ padding: "14px 0" }}>
        <b>Total to collect</b>
        <b className="strong">{money(order.total)}</b>
      </div>

      <p className="muted">Payment: Cash on Delivery</p>

      {order.note && (
        <p className="muted">Note: {order.note}</p>
      )}

      {order.status === "Not Delivered" && (
        <div className="delivery-failure">
          <strong>Delivery Unsuccessful</strong>
          <p>Reason: {order.deliveryFailureReason || "Not provided"}</p>

          {order.deliveryFailureNote && (
            <p>Details: {order.deliveryFailureNote}</p>
          )}
        </div>
      )}

      <div className="formgrid" style={{ marginTop: 15 }}>
        <label>
          Update delivery status

          <select
            className="field"
            value={showReasonForm ? "Not Delivered" : order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
          >
            {[
              "Assigned",
              "Picked up",
              "On the way",
              "Delivered",
              "Not Delivered",
            ].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        {showReasonForm && (
          <div className="delivery-failure-form">
            <h3>Why couldn't you deliver this order?</h3>

            <label>
              Select reason

              <select
                className="field"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
              >
                <option value="">Choose a reason</option>
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
                <option value="Customer refused the order">
                  Customer refused the order
                </option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Additional details (optional)

              <textarea
                className="field"
                rows="3"
                placeholder="Enter additional details..."
                value={failureNote}
                onChange={(e) => setFailureNote(e.target.value)}
              />
            </label>

            <div className="confirmation-buttons">
              <button
                className="white-button"
                onClick={() => setShowReasonForm(false)}
              >
                Cancel
              </button>

              <button
                className="green-button"
                onClick={submitFailureReason}
              >
                Submit reason
              </button>
            </div>
          </div>
        )}

        {order.status !== "Delivered" &&
          order.status !== "Not Delivered" &&
          !showReasonForm && (
            <button
              className="btn"
              onClick={() => handleStatusChange("Delivered")}
            >
              ✓ Mark as delivered
            </button>
          )}
      </div>
    </>
  );
}

export default DeliveryOrderDetails;
