import { useEffect, useState } from "react";
import { getDeliveryAgents, createDeliveryAgent } from "../../services/api";

function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDeliveryAgents();

      setAgents(data);
    } catch (err) {
      setError(err.message || "Failed to load delivery agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create delivery agent
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setCreating(true);

      await createDeliveryAgent(formData);

      setSuccess("Delivery agent account created successfully!");

      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
      });

      await loadAgents();
    } catch (err) {
      setError(err.message || "Failed to create delivery agent.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="content">
      <div className="eyebrow">DELIVERY MANAGEMENT</div>

      <h1 className="heading">Delivery agents</h1>

      <p className="sub">
        Manage your delivery team and monitor assigned orders.
      </p>

      {/* CREATE DELIVERY AGENT */}
      <div className="panel">
        <div className="panelhead">
          <div>
            <h3>Create delivery agent</h3>
            <p className="muted">Create a new delivery agent account.</p>
          </div>
        </div>

        {success && <div className="success-message">{success}</div>}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="delivery-form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                id="userName"
                name="userName"
                type="text"
                placeholder="Enter username"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn" disabled={creating}>
            {creating ? "Creating account..." : "+ Create delivery agent"}
          </button>
        </form>
      </div>

      {/* DELIVERY AGENT LIST */}
      <div className="panel">
        <div className="panelhead">
          <div>
            <h3>Delivery team</h3>
            <p className="muted">
              Monitor your delivery team and assigned orders.
            </p>
          </div>

          <span className="pill">{agents.length} registered agents</span>
        </div>

        {loading ? (
          <p className="muted">Loading delivery agents...</p>
        ) : error && agents.length === 0 ? (
          <p className="error-message">{error}</p>
        ) : agents.length === 0 ? (
          <p className="muted">
            No delivery agents found. Create your first delivery agent above.
          </p>
        ) : (
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Agent ID</th>
                  <th>Email</th>
                  <th>Assigned orders</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="strong">{agent.name}</td>

                    <td>{agent.agentCode || "Not assigned"}</td>

                    <td>{agent.email}</td>

                    <td>{agent.assignedOrders}</td>

                    <td>
                      <span className="pill">{agent.status}</span>
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

export default DeliveryAgents;
