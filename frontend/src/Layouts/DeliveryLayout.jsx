import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DeliveryLayout({ agentId, onLogout }) {
  const navigate = useNavigate();

  const nav = [
    { name: "My deliveries", path: "/delivery", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-chart-gantt preview-icon"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 8h7" /><path d="M8 12h6" /><path d="M11 16h5" /></svg> },
    { name: "Completed", path: "/delivery/completed", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check preview-icon"><path d="M20 6 9 17l-5-5" /></svg> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandmark">
            <img src="/logo-isumi mart.jpeg" alt="brandMark" />
          </div>

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