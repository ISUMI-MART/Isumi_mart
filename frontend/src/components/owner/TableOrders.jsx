
import { money } from "../../data/ownerData";

function TableOrders({ orders, updateOrder }) {
  return (
    <div className="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Delivery</th>
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
                {o.customer}
                <div className="muted">{o.address}</div>
              </td>

              <td>{o.items}</td>
              <td className="strong">{money(o.total)}</td>
              <td>{o.agent}</td>

              <td>
                <select
                  className="field"
                  value={o.status}
                  onChange={(e) =>
                    updateOrder(o.id, e.target.value)
                  }
                >
                  {[
                    "Pending",
                    "Processing",
                    "Out for Delivery",
                    "Delivered",
                    "Cancelled",
                  ].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!orders.length && (
        <div className="empty">No matching orders.</div>
      )}
    </div>
  );
}

export default TableOrders;
