import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>Isumi Mart</h3>
          <p>Your neighbourhood grocery store.</p>
          <p>Fresh essentials from our shelves to your door.</p>
        </div>

        <div>
          <h4>Quick Access</h4>
          <Link to="/products">All Products</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div>
          <h4>Customer</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div className="footer-bottom">
          © 2026 Isumi Mart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
