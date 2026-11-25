import { useEffect, useState } from "react";
const statuses = [
  { value: "ORDER_PLACED", label: "Order Placed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PREPARING", label: "Processing" },
  { value: "ASSIGNED", label: "Assigned" },
];

function money(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

function TableOrders({
  orders = [],
  updateOrder,
  assignDeliveryAgent,
  deliveryAgents = [],
  assigningOrder,
  updatingOrder,
}) {

  const [currentPage, setCurrentPage] = useState(1);

const ordersPerPage = 5;

const totalPages = Math.ceil(orders.length / ordersPerPage);

const startIndex = (currentPage - 1) * ordersPerPage;

const currentOrders = orders.slice(
    startIndex,
    startIndex + ordersPerPage
);

useEffect(() => {
    setCurrentPage(1);
}, [orders.length]);

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
            <th>Status / Update</th>
          </tr>
        </thead>

        <tbody>
          {currentOrders.map((order) => {
            const customerName =
              order.deliveryFullName ||
              order.customer ||
              [order.user?.firstName, order.user?.lastName]
                .filter(Boolean)
                .join(" ") ||
              "Customer";

            const ownerCanUpdate = [
              "ORDER_PLACED",
              "CONFIRMED",
              "PREPARING",
              "ASSIGNED",
            ].includes(order.status);

            const address =
              order.deliveryAddress || order.address?.street || "";

            const phone = order.phoneNumber || order.address?.phone || "";

            const total = order.totalAmount ?? order.total ?? 0;

            const agentName =
              order.deliveryAgent?.name ||
              [order.deliveryAgent?.firstName, order.deliveryAgent?.lastName]
                .filter(Boolean)
                .join(" ") ||
              order.deliveryAgent?.userName ||
              "Unassigned";

            // const isFinalOrder = finalStatuses.includes(order.status);
            const isFinalOrder = !ownerCanUpdate;

            return (
              <tr key={order.id}>
                {/* ORDER */}
                <td className="strong">
                  {order.orderNumber || order.id}

                  <div className="muted">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : order.date || ""}
                  </div>
                </td>

                {/* CUSTOMER */}
                <td>
                  {customerName}
                  <div className="muted">{address}</div>
                  <div className="muted">{phone}</div>
                </td>

                {/* ITEMS */}
                <td>
                  {Array.isArray(order.items) && order.items.length > 0
                    ? order.items.map((item, index) => (
                      <div key={item.id || index}>
                        {item.product?.name || item.name || "Product"} ×{" "}
                        {item.quantity}
                      </div>
                    ))
                    : "-"}
                </td>

                {/* TOTAL */}
                <td className="strong">{money(total)}</td>

                {/* DELIVERY AGENT */}
                <td>
                  <div className="agent-assignment">
                    <div className="assigned-agent">
                      <div className="agent-avatar">
                        {agentName !== "Unassigned"
                          ? agentName.charAt(0).toUpperCase()
                          : "?"}
                      </div>

                      <div className="agent-details">
                        <strong>{agentName}</strong>
                        <small>
                          {order.deliveryAgent
                            ? "Assigned agent"
                            : "Not assigned"}
                        </small>
                      </div>
                    </div>

                    <select
                      className="agent-select"
                      value={String(order.deliveryAgentId ?? "")}
                      disabled={
                        isFinalOrder ||
                        assigningOrder === order.id ||
                        deliveryAgents.length === 0
                      }
                      onChange={(e) =>
                        assignDeliveryAgent?.(order.id, e.target.value)
                      }
                    >
                      <option value="">Unassigned</option>

                      {deliveryAgents.map((agent) => {
                        const name =
                          agent.name ||
                          [agent.firstName, agent.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                          agent.userName ||
                          "Delivery Agent";

                        return (
                          <option key={agent.id} value={String(agent.id)}>
                            {name}
                          </option>
                        );
                      })}
                    </select>

                    {assigningOrder === order.id && (
                      <small className="assigning-text">Assigning...</small>
                    )}
                  </div>
                </td>

                {/* STATUS */}
                <td className="status-cell">
                  <select
                    className="field status-select"
                    value={order.status}
                    disabled={!ownerCanUpdate || updatingOrder === order.id}
                    onChange={(e) => updateOrder?.(order.id, e.target.value)}
                  >
                    {!statuses.some((status) => status.value === order.status) && (
                      <option value={order.status}>
                        {order.status === "DELIVERY_FAILED"
                          ? "Not Delivered"
                          : order.status.replaceAll("_", " ")}
                      </option>
                    )}

                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {updatingOrder === order.id && (
                    <small className="assigning-text">Updating...</small>
                  )}

                  {/* DELIVERY FAILURE */}
                  {order.status === "DELIVERY_FAILED" && (
                    <div className="delivery-failure">
                      <strong>Delivery Unsuccessful</strong>

                      <p>
                        <b>Reason:</b>{" "}
                        {order.deliveryFailureReason || "No reason provided"}
                      </p>

                      {order.deliveryFailureNote && (
                        <p>
                          <b>Additional details:</b> {order.deliveryFailureNote}
                        </p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {orders.length === 0 && (
    <div className="empty">No matching orders.</div>
)}

{totalPages > 1 && (
    <div className="pagination">
        <button
            className="btn light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
        >
            Previous
        </button>

        <span>
            Page {currentPage} of {totalPages}
        </span>

        <button
            className="btn light"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
        >
            Next
        </button>
    </div>
)}

      {orders.length === 0 && <div className="empty">No matching orders.</div>}
    </div>
  );
}

export default TableOrders;
