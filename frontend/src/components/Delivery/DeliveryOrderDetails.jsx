
import { money } from "../../data/deliveryData";

function DeliveryOrderDetails({ order, onStatusChange }) {
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

      <div
        style={{
          height: 1,
          background: "#edf1ed",
          margin: "17px 0",
        }}
      />

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
          <span style={{ fontSize: 12 }}>{item}</span>
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

      <div className="formgrid" style={{ marginTop: 15 }}>
        <label>
          Update delivery status

          <select
            className="field"
            value={order.status}
            onChange={(e) =>
              onStatusChange(order.id, e.target.value)
            }
          >
            {["Assigned", "Picked up", "On the way", "Delivered"].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
        </label>

        {order.status !== "Delivered" && (
          <button
            className="btn"
            onClick={() => onStatusChange(order.id, "Delivered")}
          >
            ✓ Mark as delivered
          </button>
        )}
      </div>
    </>
  );
}

export default DeliveryOrderDetails;
