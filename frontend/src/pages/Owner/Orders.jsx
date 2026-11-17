import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH ORDERS FROM BACKEND
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const ordersResponse = await getOrders();

      console.log("Orders:", ordersResponse);

      const ordersData = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse?.orders || ordersResponse?.data || [];

      setOrders(ordersData);

    } catch (err) {
      console.error("Orders loading error:", err);
      setError(err.message || "Failed to load orders");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // UPDATE ORDER STATUS
  const handleUpdateOrder = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);

      await fetchOrders();
    } catch (err) {
      alert(err.message || "Failed to update order");
    }
  };

  // SEARCH AND FILTER
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "All" || order.status === filter;

    const matchesSearch = [
      order.id,
      order.deliveryFullName,
      order.deliveryPhone,
      order.deliveryAddress,
      order.area,
      order.deliveryFailureReason,
      order.deliveryFailureNote,
    ]
      .filter(Boolean)
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
          <p className="sub">Manage customer purchases and order progress.</p>
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
                "Not Delivered",
                "Cancelled",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber || order.id}</td>

                    <td>{order.deliveryFullName || "N/A"}</td>

                    <td>{order.phoneNumber || "N/A"}</td>

                    <td>
                      {[
                        order.deliveryAddress,
                        order.area,
                      ]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>

                    <td>Rs. {Number(order.totalAmount || 0).toFixed(2)}</td>

                    <td>{order.status}</td>

                    <td>
                      <select
                        className="field"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrder(order.id, e.target.value)
                        }
                      >
                        {[
                          "Pending",
                          "Processing",
                          "Out for Delivery",
                          "Delivered",
                          "Not Delivered",
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
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
