import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import TrackOrder from "./pages/TrackOrder";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  createOrder,
  clearCart,
} from "./services/api";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const [cart, setCart] = useState([]);


  const hideLayout = ["/login", "/register"].includes(
    location.pathname
  );

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");

      if (!token || !user) {
        setCart([]);
        return;
      }

      try {
        const data = await getCart();
        const backendCart = data.cart || [];
        const formattedCart = backendCart.map((item) => {
          const product = item.product || {};

          return {
            id: item.productId ?? product.id ?? item.id,
            productId: item.productId ?? product.id ?? item.id,

            name: item.name ?? product.name,
            price: Number(item.price ?? product.price ?? 0),

            image: item.image ?? product.image ?? "",
            icon: item.icon ?? product.icon ?? "",

            unit: item.unit ?? product.unit ?? "",

            quantity: Number(item.quantity ?? 1),

            available: Number(
              item.available ??
              product.stock ??
              product.available ??
              999999
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

      await addCartItem(product.id, 1);

      const data = await getCart();

      const backendCart = data.cart || [];

      const formattedCart = backendCart.map((item) => {
        const backendProduct = item.product || {};

        return {
          id: item.productId ?? backendProduct.id ?? item.id,
          productId:
            item.productId ?? backendProduct.id ?? item.id,

          name: item.name ?? backendProduct.name,
          price: Number(
            item.price ?? backendProduct.price ?? 0
          ),

          image:item.image ??backendProduct.image ??"",

          icon:item.icon ??backendProduct.icon ??"",

          unit:item.unit ?? backendProduct.unit ??"",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ??
            backendProduct.stock ??
            backendProduct.available ??
            999999
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

    if (quantity < 1) {
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
          productId:item.productId ?? product.id ?? item.id,

          name: item.name ?? product.name,
          price: Number(
            item.price ?? product.price ?? 0
          ),

          image:item.image ??product.image ??"",

          icon:item.icon ??product.icon ?? "",

          unit: item.unit ?? product.unit ??"",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ??
            product.stock ??
            product.available ??
            999999
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

          image: item.image ?? product.image ?? "",

          icon:item.icon ?? product.icon ?? "",

          unit:item.unit ?? product.unit ??  "",

          quantity: Number(item.quantity ?? 1),

          available: Number(
            item.available ??
            product.stock ??
            product.available ??
            999999
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

      deliveryAddress: [
        address.street,
        address.city,
        address.postalCode,
      ]
        .filter(Boolean)
        .join(", "),

      area: address.area,

      phoneNumber:
        address.phone ||
        address.phoneNumber,

      deliveryNote:
        address.note ||
        address.deliveryNote ||
        "",

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
          cartCount={cart.reduce(
            (total, item) => total + item.quantity,
            0
          )}
          user={user}
          onLogout={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setCart([]);
          }}
        />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Home addToCart={addToCart} />} />

        <Route path="/products" element={<Products addToCart={addToCart} />} />

        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />

        <Route path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />

        <Route path="/checkout/address" element={<CheckoutAddress cart={cart} />} />

        <Route path="/checkout/summary" element={<CheckoutSummary cart={cart} placeOrder={placeOrder} />} />

        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />

        <Route path="/orders" element={<OrderHistory />} />

        <Route path="/orders/:id" element={<TrackOrder />} />

        <Route path="/profile" element={<Profile />} />

      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;