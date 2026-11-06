// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";

// // Reads a saved value from localStorage safely
// // function readSaved(key) {
// //   try {
// //     return JSON.parse(localStorage.getItem(key));
// //   } catch {
// //     return null;
// //   }
// // }

// function CheckoutAddress({ cart = [] }) {
//   const navigate = useNavigate();

//   // Start with the last address used. If none, start empty.
//   // const [address, setAddress] = useState(() => {
//   //   const saved = readSaved("checkoutAddress");
//   //   const profile = readSaved("customerProfile");
//   const [address, setAddress] = useState({
//   fullName: "",
//   phone: "",
//   street: "",
//   city: "",
//   note: "",
// });

// const [loading, setLoading] = useState(true);

//     useEffect(() => {
//   const fetchAddress = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "http://localhost:4000/api/addresses",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to retrieve address");
//       }

//       if (result.data && result.data.length > 0) {
//         const savedAddress = result.data[0];

//         setAddress((prev) => ({
//           ...prev,
//           fullName: savedAddress.fullName ?? prev.fullName,
//           phone: savedAddress.phone ?? prev.phone,
//           street: savedAddress.street ?? "",
//           city: savedAddress.city ?? "",
//           note: savedAddress.note ?? "",
//         }));

//         localStorage.setItem(
//           "checkoutAddress",
//           JSON.stringify(savedAddress)
//         );
//       }
//     } catch (error) {
//       console.error("Address retrieval error:", error);
//     }
//   };

//   fetchAddress();
// }, []);

//     return {
//       fullName: saved?.fullName ?? profile?.fullName ?? "",
//       phone: saved?.phone ?? profile?.phone ?? "",
//       street: saved?.street ?? "",
//       city: saved?.city ?? "",
//       note: saved?.note ?? "",
//     };
//   });

import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function CheckoutAddress({ cart = [] }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    note: "",
  });

  const [addressId, setAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve customer's saved address from backend
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:4000/api/addresses",
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
            fullName: savedAddress.fullName || "",
            phone: savedAddress.phone || "",
            street: savedAddress.street || "",
            city: savedAddress.city || "",
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
  }, []);

  // Nothing to check out? Go back to the cart.
  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  //   localStorage.setItem("checkoutAddress", JSON.stringify(address));
  //   navigate("/checkout/summary");
  // };

   try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        addressId
          ? `http://localhost:4000/api/addresses/${addressId}`
          : "http://localhost:4000/api/addresses",
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
