import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import "./layouts/Owner.css"


import CustomerHome from "./pages/Home";
import CustomerProducts from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutSummary from "./pages/CheckoutSummary";
import OrderConfirmation from "./pages/OrderConfirmation";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Owner layout
import OwnerLayout from "./layouts/OwnerLayouts";

// Owner pages
import Overview from "./pages/Owner/Overview";
import Orders from "./pages/Owner/Orders";
import OwnerProducts from "./pages/Owner/Products";
import Inventory from "./pages/Owner/Inventory";
import DeliveryAgents from "./pages/Owner/DeliveryAgents";
import Reports from "./pages/Owner/Reports";
import Settings from "./pages/Owner/Settings";
import WalkInSales from "./pages/Owner/WalkInSales";

import { Navigate } from "react-router-dom";

import DeliveryLayout from "./layouts/DeliveryLayout";
import DeliveryLogin from "./pages/Delivery/Login";
import DeliveryDashboard from "./pages/Delivery/Dashboard";

import { readDeliveryOrders } from "./data/deliveryData";

// Owner sample data
import {
  initialProducts,
  initialOrders,
  read,
} from "./data/ownerData";

import {
  DELIVERY_FEE,
  getNextOrderId,
  saveOrder,
} from "./data/orders";

// Customer layout
function CustomerLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const navigate = useNavigate();

  // Customer cart
  const [cart, setCart] = useState([]);

  // Owner data
  const [products, setProducts] = useState(() =>
    read("isumi-products", initialProducts)
  );

  const [orders, setOrders] = useState(() =>
    read("isumi-orders", initialOrders)
  );

  const [sales, setSales] = useState(() =>
    read("isumi-sales", [])
  );

  // Delivery agent login
  const [agentLogged, setAgentLogged] = useState(
    sessionStorage.getItem("isumi-agent-login") === "yes"
  );

  const [agentId, setAgentId] = useState(
    sessionStorage.getItem("isumi-agent-id") || "AG-001"
  );

  // Delivery orders
  const [deliveryOrders, setDeliveryOrders] = useState(
    readDeliveryOrders
  );

  // Customer cart functions
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
  };

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Owner product function
  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);

    localStorage.setItem(
      "isumi-products",
      JSON.stringify(updatedProducts)
    );
  };
  const saveSales = (updatedSales) => {
    setSales(updatedSales);

    localStorage.setItem(
      "isumi-sales",
      JSON.stringify(updatedSales)
    );
  };

  // Owner order function
  const updateOrder = (id, status) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "isumi-orders",
      JSON.stringify(updatedOrders)
    );
  };

  // Place customer order
  const placeOrder = ({ address }) => {
    if (cart.length === 0) {
      return null;
    }

    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const newOrder = {
      id: getNextOrderId(),

      date: new Date().toLocaleDateString("en-CA"),

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

      discount: 0,

      total: subtotal + DELIVERY_FEE,

      address: {
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        note: address.note,
      },

      agent: null,
    };

    // Save using the order helper
    saveOrder(newOrder);

    // Also update Owner portal orders
    setOrders((previousOrders) => {
      const updatedOrders = [newOrder, ...previousOrders];

      localStorage.setItem(
        "isumi-orders",
        JSON.stringify(updatedOrders)
      );

      return updatedOrders;
    });

    // Empty the cart after successful order placement
    setCart([]);

    return newOrder;
  };

  // Assign delivery agent to an order
const assignDeliveryAgent = (id, agent) => {
  const updatedOrders = orders.map((order) =>
    order.id === id
      ? { ...order, agent: agent || null }
      : order
  );

  setOrders(updatedOrders);

  localStorage.setItem(
    "isumi-orders",
    JSON.stringify(updatedOrders)
  );
};

  // Delivery login
  const loginAgent = (id) => {
    sessionStorage.setItem("isumi-agent-login", "yes");
    sessionStorage.setItem("isumi-agent-id", id);

    setAgentId(id);
    setAgentLogged(true);

    navigate("/delivery");
  };

  // Delivery logout
  const logoutAgent = () => {
    sessionStorage.removeItem("isumi-agent-login");
    sessionStorage.removeItem("isumi-agent-id");

    setAgentLogged(false);
  };

  // Save delivery orders
  const saveDeliveryOrders = (updatedOrders) => {
    setDeliveryOrders(updatedOrders);

    localStorage.setItem(
      "isumi-agent-orders",
      JSON.stringify(updatedOrders)
    );
  };

  return (
    <Routes>

      {/* CUSTOMER PORTAL */}
      <Route element={<CustomerLayout />}>

        <Route
          path="/"
          element={<CustomerHome addToCart={addToCart} />}
        />

        <Route
          path="/products"
          element={<CustomerProducts addToCart={addToCart} />}
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
          element={<CheckoutSummary cart={cart}
            placeOrder={placeOrder} />}
        />

        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

      </Route>

      {/* OWNER PORTAL */}
      <Route path="/owner" element={<OwnerLayout />}>

        <Route
          index
          element={
            <Overview
  products={products}
  orders={orders}
  updateOrder={updateOrder}
  assignDeliveryAgent={assignDeliveryAgent}
  navigate={navigate}
/>
          }
        />

        <Route
          path="orders"
          element={
            <Orders
  orders={orders}
  updateOrder={updateOrder}
  assignDeliveryAgent={assignDeliveryAgent}
/>
          }
        />

        <Route
          path="products"
          element={
            <OwnerProducts
              products={products}
              saveProducts={saveProducts}
            />
          }
        />

        <Route
          path="inventory"
          element={<Inventory products={products} />}
        />

        <Route
          path="delivery-agents"
          element={<DeliveryAgents orders={orders} />}
        />

        <Route
          path="reports"
          element={
            <Reports
              orders={orders}
              products={products}
            />
          }
        />

        <Route
          path="settings"
          element={<Settings />}
        />
        <Route
          path="walk-in-sales"
          element={
            <WalkInSales
              products={products}
              saveProducts={saveProducts}
              sales={sales}
              saveSales={saveSales}
            />
          }
        />


      </Route>

      {/* DELIVERY LOGIN */}
      <Route
        path="/delivery/login"
        element={
          agentLogged ? (
            <Navigate to="/delivery" replace />
          ) : (
            <DeliveryLogin onLogin={loginAgent} />
          )
        }
      />

      {/* DELIVERY PORTAL */}
      <Route
        path="/delivery"
        element={
          agentLogged ? (
            <DeliveryLayout
              agentId={agentId}
              onLogout={logoutAgent}
            />
          ) : (
            <Navigate to="/delivery/login" replace />
          )
        }
      >
        <Route
          index
          element={
            <DeliveryDashboard
              orders={deliveryOrders}
              saveOrders={saveDeliveryOrders}
              agentId={agentId}
            />
          }
        />

        <Route
          path="completed"
          element={
            <DeliveryDashboard
              orders={deliveryOrders}
              saveOrders={saveDeliveryOrders}
              showCompleted={true}
              agentId={agentId}
            />
          }
        />
      </Route>

    </Routes>
  );
}

export default App;
