import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { DELIVERY_FEE, formatAddress } from "../data/orders";

function CheckoutSummary({ cart = [], placeOrder }) {
  const navigate = useNavigate();
  const [cashReady, setCashReady] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  let address = null;
  try {
    address = JSON.parse(localStorage.getItem("checkoutAddress"));
  } catch {
    address = null;
  }

  // No items -> go to cart. No address -> go to the address step.
  if (cart.length === 0 && !orderPlaced) {
  return <Navigate to="/cart" replace />;
}
  if (!address) return <Navigate to="/checkout/address" replace />;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = 0;
  const total = subtotal + DELIVERY_FEE - discount;

  
  
const handlePlaceOrder = () => {
  const order = placeOrder({ address });

  if (!order) {
    alert("Unable to place your order. Please try again.");
    return;
  }

  setOrderPlaced(true);

  localStorage.setItem("latestOrder", JSON.stringify(order));

  navigate("/order-confirmation", {
    replace: true,
    state: { order },
  });
};


  return (
    <div className="checkout-summary-page">
      <div className="checkout-summary-container">
        <h1>Order Summary</h1>

        <p className="step-text">Step 2 of 3 — review and place your order</p>

        <div className="summary-layout">
          {/* LEFT SIDE */}
          <div className="order-summary-card">
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price.toLocaleString()}</td>
                    <td>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="price-summary">
              <div><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
              <div><span>Delivery Fee</span><span>Rs. {DELIVERY_FEE.toLocaleString()}</span></div>
              <div><span>Discount</span><span>—</span></div>
              <div className="total-row">
                <strong>Total Amount</strong>
                <strong>Rs. {total.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="summary-right">
            <div className="side-card">
              <h2>Delivery Address</h2>
              <p>{address.fullName}</p>
              <p>{address.phone}</p>
              <p>{formatAddress(address)}</p>
              {address.note && <p>Note: {address.note}</p>}

              <button className="light-button" onClick={() => navigate("/checkout/address")}>
                Edit Address
              </button>
            </div>

            <div className="side-card">
              <h2>Payment Method</h2>

              <label className="radio-row">
                <input type="radio" checked readOnly />
                <span>Cash on Delivery</span>
              </label>

              <div className="payment-message">Payment will be collected on delivery.</div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={cashReady}
                  onChange={(e) => setCashReady(e.target.checked)}
                />
                <span>I will keep the cash amount ready at delivery.</span>
              </label>

              <button
                className="green-button full-button"
                onClick={handlePlaceOrder}
                disabled={!cashReady}
              >
                Place Order (Cash on Delivery)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSummary;
