import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

// Reads a saved value from localStorage safely
function readSaved(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function CheckoutAddress({ cart = [] }) {
  const navigate = useNavigate();

  // Start with the last address used. If none, start empty.
  const [address, setAddress] = useState(() => {
    const saved = readSaved("checkoutAddress");
    const profile = readSaved("customerProfile");

    return {
      fullName: saved?.fullName ?? profile?.fullName ?? "",
      phone: saved?.phone ?? profile?.phone ?? "",
      street: saved?.street ?? "",
      city: saved?.city ?? "",
      note: saved?.note ?? "",
    };
  });

  // Nothing to check out? Go back to the cart.
  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("checkoutAddress", JSON.stringify(address));
    navigate("/checkout/summary");
  };

  return (
    <div className="checkout-address-page">
      <div className="checkout-address-container">
        <h1>Delivery Address</h1>

        <p className="step-text">
          Step 1 of 3 — Address → Order Summary → Confirmation
        </p>

        <div className="checkout-address-card">
          <form onSubmit={handleSubmit}>
            <div className="address-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" type="text" name="fullName" value={address.fullName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={address.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="street">Address (House No, Street)</label>
                <input id="street" type="text" name="street" value={address.street} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="city">City / Town</label>
                <input id="city" type="text" name="city" value={address.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="note">Delivery Note (optional)</label>
              <input
                id="note"
                type="text"
                name="note"
                value={address.note}
                onChange={handleChange}
                placeholder="Landmark, gate colour..."
              />
            </div>

            <div className="confirmation-buttons">

            <button type="submit" className="green-button">
              Continue to Order Summary
            </button>

            <button
              type="button"
              className="light-button large-button"
              onClick={() => navigate("/cart")}
            >
              Back to cart
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutAddress;
