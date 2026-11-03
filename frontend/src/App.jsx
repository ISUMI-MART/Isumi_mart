import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutSummary from "./pages/CheckoutSummary";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Owner from "./pages/Owner";
import Delivery from "./pages/Delivery";

import { DELIVERY_FEE, getNextOrderId, saveOrder } from "./data/orders";

import "./App.css";

// Small helper: reads JSON from localStorage without crashing
function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

// Scrolls to the top every time the page (route) changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [cart, setCart] = useState(() => readStorage("isumiCart", []));
  const [user, setUser] = useState(() => readStorage("isumiUser", null));

  // Keep cart and user saved, so a page refresh does not lose them
  useEffect(() => {
    localStorage.setItem("isumiCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("isumiUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("isumiUser");
    }
  }, [user]);

  // ===== ADD TO CART =====
  // quantity is optional (default 1). It never goes above the available stock.
  const addToCart = (product, quantity = 1) => {
    setCart((currentCart) => {
      const max = product.available ?? Infinity;
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, max) }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: Math.min(quantity, max) }];
    });
  };

  // ===== REMOVE FROM CART =====
  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  // ===== UPDATE QUANTITY =====
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.available ?? Infinity) }
          : item
      )
    );
  };

  // ===== PLACE ORDER =====
  // TODO (backend): replace the localStorage save with POST /api/orders
  const placeOrder = ({ address }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;

    const order = {
      id: getNextOrderId(),
      date: new Date().toISOString().slice(0, 10),
      status: "Order Placed",
      payment: "Cash on Delivery",
      paymentStatus: "Pending",
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      discount,
      total: subtotal + DELIVERY_FEE - discount,
      address,
      agent: null,
    };

    saveOrder(order);
    setCart([]);

    return order;
  };

  // ===== LOGIN / LOGOUT =====
  // TODO (backend): replace with real login/register API calls
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <ScrollToTop />

      <Navbar cartCount={cartCount} user={user} />

      <main>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />

          <Route path="/products" element={<Products addToCart={addToCart} />} />

          <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />

          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} />

          <Route path="/checkout/address" element={<CheckoutAddress cart={cart} />} />

          <Route path="/checkout/summary" element={<CheckoutSummary cart={cart} placeOrder={placeOrder} />} />

          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/orders/:orderId" element={<TrackOrder />} />

          <Route path="/profile" element={<Profile user={user} onLogout={logout} />} />

          <Route path="/login" element={<Login onLogin={login} />} />

          <Route path="/register" element={<Register onLogin={login} />} />

        
          <Route path="/owner" element={<Owner />} />
          <Route path="/delivery" element={<Delivery />} />

          {/* Unknown address */}
          <Route path="*" element={
              <div className="page-container">
                <h1>Page not found</h1>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
