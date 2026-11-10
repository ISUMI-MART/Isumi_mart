import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function CheckoutAddress({ cart = [] }) {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState({
    phone: "",
    street: "",
    area: "",
    city: "",
    postalCode: "",
    note: "",
  });

  const [addressId, setAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetch customer's saved address from backend
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You need to login first.");
          setLoading(false);
          return;
        }
        const customerResponse = await fetch(
          `${API_URL}/addresses/customer-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const customerResult = await customerResponse.json();

        if (!customerResponse.ok) {
          throw new Error(
            customerResult.message || "Failed to fetch customer details"
          );
        }

        setCustomerName(customerResult.data.name);

        const response = await fetch(`${API_URL}/addresses`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch address");
        }

        if (result.data && result.data.length > 0) {
          const savedAddress = result.data[0];

          setAddressId(savedAddress.id);

          setAddress({
            phone: savedAddress.phone || "",
            street: savedAddress.street || "",
            area: savedAddress.area || "",
            city: savedAddress.city || "",
            postalCode: savedAddress.postalCode || "",
            note: savedAddress.note || "",
          });
        }
      } catch (err) {
        console.error("Address retrieval error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [API_URL]);

  // If cart empty Go back to the cart.
  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to login first.");
        return;
      }

      const response = await fetch(
        addressId
          ? `${API_URL}/addresses/${addressId}`
          : `${API_URL}/addresses`,
        {
          method: addressId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(address),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save address");
      }

      navigate("/checkout/summary");
    } catch (err) {
      console.error("Address saving error:", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading delivery address...</p>;
  }


  return (
    <div className="checkout-address-page">
      <div className="checkout-address-container">
        <h1>Delivery Address</h1>

        <p className="step-text">
          Step 1 of 3 - Address → Order Summary → Confirmation
        </p>

        <div className="checkout-address-card">
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="error message">{error}</p>
            )}
            <div className="address-grid">
              <div className="form-group">
                <label htmlFor="customerName">Customer Name</label>
                <input id="customerName"type="text"value={customerName}readOnly/>
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
                <label htmlFor="area">Area</label>
                <input id="area" type="text" name="area" value={address.area} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="city">City / Town</label>
                <input id="city" type="text" name="city" value={address.city} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input id="postalCode" type="text" name="postalCode" value={address.postalCode} onChange={handleChange} />
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

            <button type="submit" className="green-button">
              Continue to Order Summary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutAddress;
