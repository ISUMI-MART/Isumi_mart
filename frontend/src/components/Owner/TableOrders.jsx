// import { money } from "../../data/ownerData";

// function TableOrders({
//   orders,
//   updateOrder,
//   assignDeliveryAgent
// }) {
//   return (
//     <div className="tablewrap">
//       <table>
//         <thead>
//           <tr>
//             <th>Order</th>
//             <th>Customer</th>
//             <th>Items</th>
//             <th>Total</th>
//             <th>Delivery Agent</th>
//             <th>Status / update</th>
//           </tr>
//         </thead>

//         <tbody>
//           {orders.map((o) => (
//             <tr key={o.id}>
//               <td className="strong">
//                 {o.id}
//                 <div className="muted">{o.date}</div>
//               </td>

//               <td>
//                 {o.customer || o.address?.fullName || "Walk-in Customer"}

//                 <div className="muted">
//                   {o.address
//                     ? `${o.address.street || ""}, ${o.address.city || ""}`
//                     : ""}
//                 </div>

//                 <div className="muted">
//                   {o.address?.phone || ""}
//                 </div>
//               </td>

//               <td>
//                 {Array.isArray(o.items)
//                   ? o.items.map((item) => (
//                       <div key={item.id}>
//                         {item.name} × {item.quantity}
//                       </div>
//                     ))
//                   : o.items || "-"}
//               </td>

//               <td className="strong">
//                 {money(o.total)}
//               </td>

//               {/* Assign delivery agent */}
//               <td>
//                 <select
//                   className="field"
//                   value={
//                     typeof o.agent === "string"
//                       ? o.agent
//                       : o.agent?.shortName || ""
//                   }
//                   onChange={(e) =>
//                     assignDeliveryAgent(o.id, e.target.value)
//                   }
//                 >
//                   <option value="">Unassigned</option>
//                   <option value="Ruwan">Ruwan Perera</option>
//                   <option value="Nuwan">Nuwan Silva</option>
//                 </select>
//               </td>

//               {/* Update order status */}
//               <td>
//                 <select
//                   className="field"
//                   value={o.status}
//                   onChange={(e) =>
//                     updateOrder(o.id, e.target.value)
//                   }
//                 >
//                   {[
//                     "Order Placed",
//                     "Pending",
//                     "Processing",
//                     "Out for Delivery",
//                     "Delivered",
//                     "Cancelled",
//                     "Not Delivered"
//                   ].map((status) => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Delivery failure information */}
//                 {o.status === "Not Delivered" && (
//                   <div className="delivery-failure">
//                     <strong>Delivery Unsuccessful</strong>

//                     <p>
//                       <b>Reason:</b>{" "}
//                       {o.deliveryFailureReason || "No reason provided"}
//                     </p>

//                     {o.deliveryFailureNote && (
//                       <p>
//                         <b>Additional details:</b>{" "}
//                         {o.deliveryFailureNote}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {!orders.length && (
//         <div className="empty">
//           No matching orders.
//         </div>
//       )}
//     </div>
//   );
// }

// export default TableOrders;

function money(value) {
  return `Rs. ${Number(value || 0).toFixed(2)}`;
}

const statuses = [
  {
    value: "ORDER_PLACED",
    label: "Order Placed",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
  },
  {
    value: "PREPARING",
    label: "Processing",
  },
  {
    value: "ASSIGNED",
    label: "Assigned",
  },
  {
    value: "PICKED_UP",
    label: "Picked Up",
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
  },
  {
    value: "DELIVERED",
    label: "Delivered",
  },
  {
    value: "DELIVERY_FAILED",
    label: "Not Delivered",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

function TableOrders({
  orders = [],
  updateOrder,
  assignDeliveryAgent,
  deliveryAgents = [],
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
          {orders.map((o) => {
            const customerName =
              o.deliveryFullName ||
              o.customer ||
              [o.user?.firstName, o.user?.lastName]
                .filter(Boolean)
                .join(" ") ||
              "Customer";

            const address =
              o.deliveryAddress ||
              o.address?.street ||
              "";

            const phone =
              o.phoneNumber ||
              o.address?.phone ||
              "";

            const total =
              o.totalAmount ??
              o.total ??
              0;

            return (
              <tr key={o.id}>
                {/* ORDER */}
                <td className="strong">
                  {o.id}

                  <div className="muted">
                    {o.createdAt
                      ? new Date(
                          o.createdAt
                        ).toLocaleDateString()
                      : o.date || ""}
                  </div>
                </td>

                {/* CUSTOMER */}
                <td>
                  {customerName}

                  <div className="muted">
                    {address}
                  </div>

                  <div className="muted">
                    {phone}
                  </div>
                </td>

                {/* ITEMS */}
                <td>
                  {Array.isArray(o.items) &&
                  o.items.length > 0 ? (
                    o.items.map((item) => (
                      <div key={item.id}>
                        {item.product?.name ||
                          item.name ||
                          "Product"}{" "}
                        × {item.quantity}
                      </div>
                    ))
                  ) : (
                    "-"
                  )}
                </td>

                {/* TOTAL */}
                <td className="strong">
                  {money(total)}
                </td>

                {/* DELIVERY AGENT */}
                <td>
                  <select
                    className="field"
                    value={
                      o.deliveryAgentId
                        ? String(o.deliveryAgentId)
                        : ""
                    }
                    onChange={(e) =>
                      assignDeliveryAgent?.(
                        o.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {deliveryAgents.map((agent) => (
                      <option
                        key={agent.id}
                        value={agent.id}
                      >
                        {agent.firstName ||
                          agent.userName ||
                          "Agent"}

                        {agent.lastName
                          ? ` ${agent.lastName}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </td>

                {/* STATUS */}
                <td>
                  <select
                    className="field"
                    value={o.status}
                    onChange={(e) =>
                      updateOrder?.(
                        o.id,
                        e.target.value
                      )
                    }
                  >
                    {statuses.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>

                  {/* DELIVERY FAILURE */}
                  {o.status ===
                    "DELIVERY_FAILED" && (
                    <div className="delivery-failure">
                      <strong>
                        Delivery Unsuccessful
                      </strong>

                      <p>
                        <b>Reason:</b>{" "}
                        {o.deliveryFailureReason ||
                          "No reason provided"}
                      </p>

                      {o.deliveryFailureNote && (
                        <p>
                          <b>
                            Additional details:
                          </b>{" "}
                          {o.deliveryFailureNote}
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
        <div className="empty">
          No matching orders.
        </div>
      )}
    </div>
  );
}

export default TableOrders;