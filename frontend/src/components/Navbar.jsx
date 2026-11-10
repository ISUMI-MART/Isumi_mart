import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";



function Navbar({ cartCount = 0, user, onLogout }) {

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onLogout();

    setShowMenu(false);

    window.location.href = "/";
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <img src="logo-isumi mart.jpeg" alt="Isumi Mart Logo" className="logo-mark" />
            Isumi&nbsp;<em>Mart</em>
          </Link>

          {/* Desktop links (hidden on small screens, the bottom bar is used instead) */}
          <nav className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/orders">Orders</NavLink>
            {user && <NavLink to="/profile">Profile</NavLink>}
          </nav>

          <div className="nav-actions">
            <Link to="/cart" className="cart-button">
              Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="profile-menu">

                <button
                  type="button"
                  className="user-icon-button"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-label="Open profile menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                </button>

                {showMenu && (
                  <div className="profile-dropdown">

                    <Link
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                    >
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>

                  </div>
                )}

              </div>
            ) : (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile tab bar  */}
      <nav className="bottom-nav">
        <NavLink to="/" end>🏠<span>Home</span></NavLink>
        <NavLink to="/products">🛍️<span>Products</span></NavLink>
        <NavLink to="/cart">🛒<span>Cart</span></NavLink>
        <NavLink to="/orders">📦<span>Orders</span></NavLink>
      </nav>
    </>
  );
}
export default Navbar