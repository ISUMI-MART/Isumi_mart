import React from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar({ cartCount = 0, user }) {
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">I</span>
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
              <Link to="/profile" className="login-link">Profile</Link>
            ) : (
              <Link to="/login" className="login-link">Login</Link>
            )}
          </div>
        </div>
      </header>

      {/* Bottom tab bar - the reference site has Home, Shop, Cart, Orders */}
      <nav className="bottom-nav">
        <NavLink to="/" end>🏠<span>Home</span></NavLink>
        <NavLink to="/products">🛍️<span>Products</span></NavLink>
        <NavLink to="/cart">🛒<span>Cart</span></NavLink>
        <NavLink to="/orders">📦<span>Orders</span></NavLink>
      </nav>
    </>
  );
}

export default Navbar;