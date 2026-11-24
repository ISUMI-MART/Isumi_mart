import { useEffect, useState } from "react";
import TableOrders from "../../components/Owner/TableOrders";
import {
  getOrders,
  updateOrderStatus,
  getDeliveryAgents,
  assignDeliveryAgent,
} from "../../services/api";

const statusLabels = {
  ORDER_PLACED: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  DELIVERY_FAILED: "Not Delivered",
  CANCELLED: "Cancelled",
};

const statusOptions = [
  "ORDER_PLACED",
  "CONFIRMED",
  "PREPARING",
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "CANCELLED",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [assigningOrder, setAssigningOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // FETCH ORDERS AND DELIVERY AGENTS
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [ordersResponse, agentsResponse] = await Promise.all([
        getOrders(),
        getDeliveryAgents(),
      ]);

      const ordersData = Array.isArray(ordersResponse)
        ? ordersResponse
        : ordersResponse?.data?.orders ||
          ordersResponse?.data ||
          ordersResponse?.orders ||
          [];

      const agentsData = Array.isArray(agentsResponse)
        ? agentsResponse
        : agentsResponse?.data || [];

      setOrders(ordersData);
      setAgents(agentsData);
    } catch (err) {
      console.error("Orders loading error:", err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UPDATE ORDER STATUS
  const handleUpdateOrder = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);

      await updateOrderStatus(orderId, status);

      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to update order.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ASSIGN DELIVERY AGENT
  const handleAssignAgent = async (orderId, agentId) => {
    if (!agentId) return;

    try {
      setAssigningOrder(orderId);

      await assignDeliveryAgent(orderId, agentId);

      alert("Delivery agent assigned successfully!");

      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to assign delivery agent.");
    } finally {
      setAssigningOrder(null);
    }
  };

  // SEARCH AND FILTER
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "All" || order.status === filter;

    const matchesSearch = [
      order.id,
      order.deliveryFullName,
      order.phoneNumber,
      order.deliveryAddress,
      order.area,
      order.deliveryAgent?.firstName,
      order.deliveryAgent?.lastName,
      order.deliveryAgent?.agentCode,
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
              placeholder="Search order, customer or agent..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              className="field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
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
            <TableOrders
              orders={filteredOrders}
              deliveryAgents={agents}
              updateOrder={handleUpdateOrder}
              assignDeliveryAgent={handleAssignAgent}
              assigningOrder={assigningOrder}
              updatingOrder={updatingOrder}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
