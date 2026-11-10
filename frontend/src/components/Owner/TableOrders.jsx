import { money } from "../../data/ownerData";

function TableOrders({
  orders,
  updateOrder,
  assignDeliveryAgent
}) {
  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Delivery Agent</th>
            <th>Status / update</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="strong">
                {o.id}
                <div className="muted">{o.date}</div>
              </td>

              <td>
                {o.customer || o.address?.fullName || "Walk-in Customer"}

                <div className="muted">
                  {o.address
                    ? `${o.address.street || ""}, ${o.address.city || ""}`
                    : ""}
                </div>

                <div className="muted">
                  {o.address?.phone || ""}
                </div>
              </td>

              <td>
                {Array.isArray(o.items)
                  ? o.items.map((item) => (
                      <div key={item.id}>
                        {item.name} × {item.quantity}
                      </div>
                    ))
                  : o.items || "-"}
              </td>

              <td className="strong">
                {money(o.total)}
              </td>

              {/* Assign delivery agent */}
              <td>
                <select
                  className="field"
                  value={
                    typeof o.agent === "string"
                      ? o.agent
                      : o.agent?.shortName || ""
                  }
                  onChange={(e) =>
                    assignDeliveryAgent(o.id, e.target.value)
                  }
                >
                  <option value="">Unassigned</option>
                  <option value="Ruwan">Ruwan Perera</option>
                  <option value="Nuwan">Nuwan Silva</option>
                </select>
              </td>

              {/* Update order status */}
              <td>
                <select
                  className="field"
                  value={o.status}
                  onChange={(e) =>
                    updateOrder(o.id, e.target.value)
                  }
                >
                  {[
                    "Order Placed",
                    "Pending",
                    "Processing",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                    "Not Delivered"
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {/* Delivery failure information */}
                {o.status === "Not Delivered" && (
                  <div className="delivery-failure">
                    <strong>Delivery Unsuccessful</strong>

                    <p>
                      <b>Reason:</b>{" "}
                      {o.deliveryFailureReason || "No reason provided"}
                    </p>

                    {o.deliveryFailureNote && (
                      <p>
                        <b>Additional details:</b>{" "}
                        {o.deliveryFailureNote}
                      </p>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!orders.length && (
        <div className="empty">
          No matching orders.
        </div>
      )}
    </div>
  );
}

export default TableOrders;