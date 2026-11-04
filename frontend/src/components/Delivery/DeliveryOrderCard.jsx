
import { money } from "../../data/deliveryData";

function DeliveryOrderCard({ order, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(order)}
      style={{
        width: "100%",
        background: selected ? "#f1f8f0" : "white",
        border: "1px solid #edf1ed",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        textAlign: "left",
      }}
    >
      <div className="row">
        <b className="strong">{order.id}</b>

        <span
          className={
            "pill " +
            (order.status === "Delivered" ? "" : "orange")
          }
        >
          {order.status}
        </span>
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          margin: "9px 0 4px",
          color: "#314438",
        }}
      >
        {order.customer}
      </div>

      <div className="muted">
        ⌖ {order.area} · {order.time}
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <span className="muted">
          {order.items.length} item types
        </span>

        <b className="strong">{money(order.total)}</b>
      </div>
    </button>
  );
}

export default DeliveryOrderCard;
