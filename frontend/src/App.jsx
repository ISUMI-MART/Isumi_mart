import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import ProtectedRoute from "./components/ProtecterRoute";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import CheckoutAddress from "./pages/CheckoutAddress";
import CheckoutSummary from "./pages/CheckoutSummary";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import {getCart,addCartItem,updateCartItem,removeCartItem,createOrder,clearCart,} from "./services/api";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

//Owner
import OwnerLayout from "./Layouts/OwnerLayouts";

import DeliveryAgents from "./pages/Owner/DeliveryAgents";
import Inventory from "./pages/Owner/Inventory";
import Orders from "./pages/Owner/Orders";
import Overview from "./pages/Owner/Overview";
//import Products from "./pages/Owner/Products";
import Reports from "./pages/Owner/Reports";
import Settings from "./pages/Owner/Settings";
import WalkInSales from "./pages/Owner/WalkInSales";

// Delivery
import DeliveryLayout from "./Layouts/DeliveryLayout";
import Dashboard from "./pages/Delivery/Dashboard";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });
  const activeUser =
  user || JSON.parse(localStorage.getItem("user") || "null");

  const [cart, setCart] = useState([]);

  //Hide customer components from login, registor, owner, delivery portals
  const hideLayout =
    ["/login", "/register"].includes(location.pathname) ||
    location.pathname.startsWith("/owner") || location.pathname.startsWith("/delivery");

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");

      if (!token || !user || user.role != "CUSTOMER") {
        setCart([]);
        return;
      }

      try {
        const data = await getCart();
        const backendCart = data.cart || [];
        const formattedCart = backendCart.map((item) => {
          const product = item.product || {};

          return {

            //cart actions

            id: item.productId ?? product.id ?? item.id,
            productId: item.productId ?? product.id ?? item.id,

            name: item.name ?? product.name,
            price: Number(item.price ?? product.price ?? 0),

            image:
              item.imageUrl ||
              item.image ||
              item.product?.imageUrl ||
              item.product?.image ||
              product.imageUrl ||
              product.image ||
              "",
            icon: item.icon ?? product.icon ?? "",

            unit: item.unit ?? product.unit ?? "",

            quantity: Number(item.quantity ?? 1),

            available: Number(
              item.available ?? product.stock ?? product.available ?? 999999,
            ),
          };
        });

        setCart(formattedCart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
  }, [user]);

  // ADD PRODUCT TO CART
  const addToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token || !user) {
      alert("Please login to add products to your cart.");
      navigate("/login");
      return;
    }

    try {
      const initialQuantity = /kg|kilogram/i.test(product.unit || "")
        ? 0.25
        : 1;

      await addCartItem(product.id, initialQuantity);

      const data = await getCart();

      const backendCart = data.cart || [];

      const formattedCart = backendCart.map((item) => {
        const backendProduct = item.product || {};

        return {
          id: item.productId ?? backendProduct.id ?? item.id,
          productId: item.productId ?? backendProduct.id ?? item.id,

          name: item.name ?? backendProduct.name,
          price: Number(item.price ?? backendProduct.price ?? 0),

          image:
            item.imageUrl ||
            item.image ||
            item.product?.imageUrl ||
            item.product?.image ||
            product.imageUrl ||
            product.image ||
            "",
          icon: item.icon ?? backendProduct.icon ?? "",

          unit: item.unit ?? backendProduct.unit ?? "",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ??
            backendProduct.stock ??
            backendProduct.available ??
            999999,
          ),
        };
      });

      setCart(formattedCart);

      alert(`${product.name} added to cart successfully!`);
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message);
    }
  };

  // UPDATE PRODUCT QUANTITY
  const updateQuantity = async (productId, quantity) => {
    const existingItem = cart.find((item) => item.productId === productId);

    if (!existingItem) return;

    const isWeightProduct = /kg|kilogram/i.test(existingItem.unit || "");

    const minimumQuantity = isWeightProduct ? 0.25 : 1;

    quantity = Number(Number(quantity).toFixed(2));

    if (quantity < minimumQuantity) {
      return;
    }

    if (quantity > existingItem.available) {
      alert("Not enough stock available.");
      return;
    }
    try {
      await updateCartItem(productId, quantity);

      // Reload cart after update
      const data = await getCart();

      const backendCart = data.cart || [];

      const formattedCart = backendCart.map((item) => {
        const product = item.product || {};

        return {
          id: item.productId ?? product.id ?? item.id,
          productId: item.productId ?? product.id ?? item.id,

          name: item.name ?? product.name,
          price: Number(item.price ?? product.price ?? 0),

          image:
            item.imageUrl ||
            item.image ||
            item.product?.imageUrl ||
            item.product?.image ||
            product.imageUrl ||
            product.image ||
            "",
          icon: item.icon ?? product.icon ?? "",

          unit: item.unit ?? product.unit ?? "",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ?? product.stock ?? product.available ?? 999999,
          ),
        };
      });

      setCart(formattedCart);
    } catch (error) {
      console.error("Update cart error:", error);
      alert(error.message);
    }
  };

  // REMOVE PRODUCT FROM CART
  const removeFromCart = async (productId) => {
    try {
      await removeCartItem(productId);

      // Reload cart after removing
      const data = await getCart();

      const backendCart = data.cart || [];

      const formattedCart = backendCart.map((item) => {
        const product = item.product || {};

        return {
          id: item.productId ?? product.id ?? item.id,
          productId: item.productId ?? product.id ?? item.id,

          name: item.name ?? product.name,
          price: Number(item.price ?? product.price ?? 0),

          image:
            item.imageUrl ||
            item.image ||
            item.product?.imageUrl ||
            item.product?.image ||
            product.imageUrl ||
            product.image ||
            "",
          icon: item.icon ?? product.icon ?? "",

          unit: item.unit ?? product.unit ?? "",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ?? product.stock ?? product.available ?? 999999,
          ),
        };
      });

      setCart(formattedCart);
    } catch (error) {
      console.error("Remove cart item error:", error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location.pathname]);

  const placeOrder = async ({ address }) => {
    if (!user) {
      throw new Error("Please login before placing an order.");
    }

    if (!cart || cart.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const orderData = {
      deliveryFullName:
        address.fullName ||
        address.name ||
        `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
        user?.userName,

      deliveryAddress: [address.street, address.city, address.postalCode]
        .filter(Boolean)
        .join(", "),

      area: address.area,

      phoneNumber: address.phone || address.phoneNumber,

      deliveryNote: address.note || address.deliveryNote || "",

      items: cart.map((item) => ({
        productId: Number(item.productId ?? item.id),
        quantity: Number(item.quantity),
      })),
    };

    console.log("Sending order:", orderData);

    const result = await createOrder(orderData);

    if (!result.data) {
      throw new Error("The server did not return the created order.");
    }

    await clearCart();
    setCart([]);

    return result.data;
  };

  return (
    <>
      {!hideLayout && (
        <Navbar
          cartCount={cart.length}
          user={user}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setCart([]);
          }}
        />
      )}

      {/* Login , Register routes */}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* customer routes */}

        <Route path="/" element={<Home addToCart={addToCart} />} />

        <Route path="/products" element={<Products addToCart={addToCart} />} />

        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />}/>

        <Route path="/cart" element={ <ProtectedRoute><Cart cart={cart} removeFromCart={removeFromCart}updateQuantity={updateQuantity}/></ProtectedRoute>}/>

        <Route path="/checkout/address" element={<ProtectedRoute><CheckoutAddress cart={cart} /></ProtectedRoute>} />

        <Route path="/checkout/summary" element={<ProtectedRoute><CheckoutSummary cart={cart} placeOrder={placeOrder} /></ProtectedRoute>}/>

        <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

        <Route path="/orders" element={<OrderHistory />} />

        <Route path="/orders/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

        <Route path="/profile" element={<Profile />} />

        {/* OWNER ROUTES */}

        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<ProtectedRoute><Navigate to="overview" replace /></ProtectedRoute>} />

          <Route path="overview" element={<ProtectedRoute><Overview /></ProtectedRoute>} />

          <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

          <Route path="products" element={<ProtectedRoute><Products /></ProtectedRoute>} />

          <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />

          <Route path="delivery-agents" element={<ProtectedRoute><DeliveryAgents /></ProtectedRoute>} />

          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="walk-in-sales" element={<ProtectedRoute><WalkInSales /></ProtectedRoute>} />

          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>

        {/* DELIVERY AGENT ROUTES */}

        <Route path="/delivery" element={activeUser?.role === "DELIVERY_AGENT" ? (
              <DeliveryLayout
                agentId={activeUser.userName || "Delivery Agent"}
                onLogout={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setUser(null);
                  setCart([]);
                  navigate("/login");
                }}
              />
            ) : (
              <Navigate to="/login" replace />
            )}>

          <Route index element={ <Dashboard agentId={activeUser?.userName || "Delivery Agent"} /> } />

          <Route path="completed"  element={ <Dashboard showCompleted={true} agentId={activeUser?.userName || "Delivery Agent"}  />  } /></Route>

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
