import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutSummary from "./pages/CheckoutSummary";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  const location = useLocation();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const hideLayout = ["/login", "/register"].includes(
    location.pathname
  );

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location.pathname]);

  // Add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });

    // Show success alert
    window.alert(`${product.name} added to cart successfully!`);
  };

  // Remove a product from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // Update product quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const placeOrder = ({ address }) => {
    if (cart.length === 0) {
      return null;
    }

    //temperory

    const order = {
      id: `IM-${Date.now()}`,
      items: cart,
      address: address,
      total: cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      status: "ORDER_PLACED",
      paymentMethod: "CASH_ON_DELIVERY",
      createdAt: new Date().toISOString(),
    };

    return order;
  };

  return (
    <>
      {!hideLayout && (
        <Navbar
          cartCount={cart.reduce(
            (total, item) => total + item.quantity,
            0
          )}
          user={user}
          onLogout={() => setUser(null)}
        />
      )}



      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={<Home addToCart={addToCart} />}
        />

        <Route
          path="/products"
          element={<Products addToCart={addToCart} />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />

        <Route
          path="/checkout/address"
          element={<CheckoutAddress cart={cart} />}
        />

        <Route
          path="/checkout/summary"
          element={<CheckoutSummary cart={cart} placeOrder={placeOrder} />}
        />

        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        <Route
          path="/profile"
          element={
            
              <Profile />
            
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;