import TableOrders from "../../components/owner/TableOrders";
import { money } from "../../data/ownerData";

function Overview({ products, orders, updateOrder, navigate }) {
  const pending = orders.filter(
    (o) => !["Delivered", "Cancelled"].includes(o.status)
  ).length;

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  );

  const stats = [
    ["Total orders", orders.length, "▤", "Across all time"],
    ["To be processed", pending, "◷", "Orders needing attention"],
    ["Products", products.length, "▧", "Active catalogue"],
    ["Low stock items", lowStock.length, "⚑", "Restock soon"],
  ];

  return (
    <section className="content">
      <div className="eyebrow">OWNER DASHBOARD</div>

      <div className="row">
        <div>
          <h1 className="heading">Shop overview</h1>
          <p className="sub">
            Here is what is happening with your grocery shop today.
          </p>
        </div>
      </div>

      <div className="stats">
        {stats.map(([label, value, icon, description]) => (
          <div className="stat" key={label}>
            <div className="stat-top">
              <span>{label}</span>
              <span className="stat-icon">{icon}</span>
            </div>
            <strong>{value}</strong>
            <small>{description}</small>
          </div>
        ))}
      </div>

      <div className="grid2">
        <div className="panel">
          <div className="panelhead">
            <h3>Recent orders</h3>
            <button
              className="btn light"
              onClick={() => navigate("/owner/orders")}
            >
              View all →
            </button>
          </div>

          <TableOrders
            orders={orders.slice(0, 4)}
            updateOrder={updateOrder}
          />
        </div>

        <div className="panel">
          <div className="panelhead">
            <h3>Inventory alerts</h3>
            <button
              className="btn light"
              onClick={() => navigate("/owner/inventory")}
            >
              View stock →
            </button>
          </div>

          {lowStock.map((product) => (
            <div
              className="row"
              style={{
                padding: "11px 0",
                borderBottom: "1px solid #f0f3f0",
              }}
              key={product.id}
            >
              <div className="productcell">
                <span className="thumb">{product.emoji}</span>
                <div>
                  <b className="strong">{product.name}</b>
                  <div className="muted">{product.category}</div>
                </div>
              </div>

              <span className="pill orange">
                {product.stock} left
              </span>
            </div>
          ))}

          {lowStock.length === 0 && (
            <p className="muted">No low-stock products.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>Quick actions</h3>
        </div>

        <div className="quickgrid">
          {[
            ["＋", "Add a product", "Update your shop catalogue", "/owner/products"],
            ["▤", "Review new orders", "Process customer purchases", "/owner/orders"],
            ["♙", "Delivery team", "Check delivery assignments", "/owner/delivery-agents"],
          ].map(([icon, title, description, path]) => (
            <button
              className="quick"
              key={title}
              onClick={() => navigate(path)}
              style={{ textAlign: "left", cursor: "pointer" }}
            >
              <span>{icon}</span>
              <b>{title}</b>
              <small>{description} →</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Overview;