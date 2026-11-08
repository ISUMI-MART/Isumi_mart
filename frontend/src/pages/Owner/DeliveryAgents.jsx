function DeliveryAgents({ orders }) {
  const agents = [
    { name: "Ruwan Perera", id: "AG-001", shortName: "Ruwan" },
    { name: "Nuwan Silva", id: "AG-002", shortName: "Nuwan" },
  ];

  return (
    <section className="content">
      <div className="eyebrow">DELIVERY MANAGEMENT</div>

      <h1 className="heading">Delivery agents</h1>
      <p className="sub">
        Monitor your delivery team and assigned orders.
      </p>

      <div className="panel">
        <div className="panelhead">
          <h3>Delivery team</h3>
          <span className="pill">2 active agents</span>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Agent ID</th>
                <th>Assigned orders</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {agents.map((agent) => {
                const assigned = orders.filter(
                  (order) =>
                    order.agent === agent.shortName &&
                    !["Delivered", "Cancelled"].includes(order.status)
                ).length;

                return (
                  <tr key={agent.id}>
                    <td className="strong">{agent.name}</td>
                    <td>{agent.id}</td>
                    <td>{assigned}</td>
                    <td>
                      <span className="pill">
                        {assigned > 0 ? "On delivery" : "Available"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="muted" style={{ marginTop: 18 }}>
          Delivery agent information is currently sample data.
        </p>
      </div>
    </section>
  );
}

export default DeliveryAgents;