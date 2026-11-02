import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h3>🛒 Isumi Mart</h3>
          <p>Your neighbourhood grocery store.</p>
          <p>Fresh essentials from our shelves to your door.</p>
        </div>

        <div>
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/products?category=Vegetables">Vegetables</Link>
          <Link to="/products?category=Fruits">Fruits</Link>
          <Link to="/products?category=Dairy%20%26%20Eggs">Dairy & Eggs</Link>
        </div>

        <div>
          <h4>Customer</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div>
          <h4>Staff</h4>
          <Link to="/owner">Owner / Cashier</Link>
          <Link to="/delivery">Delivery Agent</Link>
        </div>
      </div>

      <div className="footer-bottom">© 2026 Isumi Mart. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
