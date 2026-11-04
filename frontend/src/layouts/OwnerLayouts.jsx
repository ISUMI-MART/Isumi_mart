
import { NavLink, Outlet } from "react-router-dom";
import "./Owner.css";

function OwnerLayout() {
  const nav = [
    { name: "Overview", path: "/owner", icon: "▦" },
    { name: "Orders", path: "/owner/orders", icon: "▤" },
    { name: "Products", path: "/owner/products", icon: "▧" },
    { name: "Inventory", path: "/owner/inventory", icon: "▥" },
    { name: "Delivery agents", path: "/owner/delivery-agents", icon: "♙" },
    { name: "Reports", path: "/owner/reports", icon: "▨" },
    { name: "Settings", path: "/owner/settings", icon: "⚙" },
    { name: "Walk-in Sales", path: "/owner/walk-in-sales", icon: "🛒" },
  ];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandmark">🌿</div>
          <div>
            <strong>Isumi Mart</strong>
            <small>OWNER PORTAL</small>
          </div>
        </div>

        <div className="navlabel">WORKSPACE</div>

        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/owner"}
            >
              <span className="ico">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebottom">
          <div className="avatar">A</div>
          <div>
            <b>Shop Administrator</b>
            <small>Owner account</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="crumb">Isumi Mart / Owner Portal</span>

          <span className="topright">
            <span>
              <i className="online" />
              System operational
            </span>
            <b>⌕</b>
          </span>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default OwnerLayout;
