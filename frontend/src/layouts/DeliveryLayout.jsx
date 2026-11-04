
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DeliveryLayout({ agentId, onLogout }) {
  const navigate = useNavigate();

  const nav = [
    { name: "My deliveries", path: "/delivery", icon: "▤" },
    { name: "Completed", path: "/delivery/completed", icon: "✓" },
  ];

  const handleLogout = () => {
    onLogout();
    navigate("/delivery/login");
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandmark">🌿</div>

          <div>
            <strong>Isumi Mart</strong>
            <small>DELIVERY PARTNER</small>
          </div>
        </div>

        <div className="navlabel">MY WORK</div>

        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/delivery"}
            >
              <span className="ico">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebottom">
          <div className="avatar">
            {agentId.charAt(0).toUpperCase()}
          </div>

          <div>
            <b>Delivery Partner</b>
            <small>{agentId} · Delivery agent</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="crumb">
            Isumi Mart / Delivery workspace
          </span>

          <span className="topright">
            <span>
              <i className="online" />
              On duty
            </span>

            <button
              className="btn outline"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </span>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

export default DeliveryLayout;
