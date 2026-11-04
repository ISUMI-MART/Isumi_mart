
import { useState } from "react";
import TableOrders from "../../components/owner/TableOrders";

function Orders({ orders, updateOrder }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filter === "All" || order.status === filter;

    const matchesSearch = [
  order.id,
  order.customer,
  order.address?.fullName,
  order.address?.phone,
  order.address?.street,
  order.address?.city,
]
  .join(" ")
  .toLowerCase()
  .includes(query.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <section className="content">
      <div className="eyebrow">ORDER MANAGEMENT</div>

      <div className="row">
        <div>
          <h1 className="heading">Orders</h1>
          <p className="sub">
            Manage customer purchases and order progress.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>
            All orders <span className="muted">({orders.length})</span>
          </h3>

          <div className="filters">
            <input
              className="field search"
              placeholder="Search order or customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {[
                "All",
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
          </div>
        </div>

        <TableOrders
          orders={filteredOrders}
          updateOrder={updateOrder}
        />
      </div>
    </section>
  );
}

export default Orders;
