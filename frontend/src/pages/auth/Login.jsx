
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { loginCustomer } from "../../services/authService";
// import "../Auth.css";

// function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const message = location.state?.message;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const data = await loginCustomer(formData);

//       if (data.user.role !== "CUSTOMER") {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setError("This login is for customer accounts only.");
//         return;
//       }

//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-container">
//         <div className="auth-brand">
//           <h2>Isumi Mart</h2>
//           <p>Your everyday grocery partner</p>
//         </div>

//         <div className="auth-content">
//           <h1>Welcome Back!</h1>
//           <p className="auth-subtitle">
//             Log in to your Isumi Mart account.
//           </p>

//           {message && <div className="auth-success">{message}</div>}
//           {error && <div className="auth-error">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="auth-field">
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>

//             <div className="auth-field">
//               <label>Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="auth-submit"
//               disabled={loading}
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>

//           <p className="auth-switch">
//             Don't have an account? <Link to="/register">Create an account</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginCustomer } from "../../services/authService";
import "../../layouts/auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const message = location.state?.message;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginCustomer(formData);

      if (data.user.role !== "CUSTOMER") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("This login is for customer accounts only.");
        return;
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Branding Panel */}
      <div className="auth-left-panel">
        <div className="auth-brand-header">
          <h2 className="auth-logo">isumi mart.</h2>
          <span className="auth-tagline">
            YOUR NEIGHBORHOOD, NOW ONLINE
          </span>
        </div>

        <div className="auth-hero-text">
          <h1>Good food.</h1>
          <h1>A little closer to home.</h1>
          <p>
            Shop fresh produce and everyday essentials
            from the grocery shop you know and trust.
          </p>
        </div>

        <div className="auth-image-container">
          <img
            src="grocery-table.jpg"
            alt="Fresh fruits and vegetables"
          />
        </div>

        <div className="auth-brand-footer">
          <p>Fresh essentials. Friendly service. Every day.</p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <span className="auth-portal-label">CUSTOMER PORTAL</span>

          <h1>Welcome back</h1>

          <p className="auth-subtitle">
            Sign in to shop fresh with Isumi Mart.
          </p>

          {message && (
            <div className="auth-success">{message}</div>
          )}

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              New to Isumi Mart?{" "}
              <Link to="/register">Create an account</Link>
            </p>

            <div className="auth-divider"></div>

            <p className="auth-checkout-note">
              Safe and simple checkout. Cash on Delivery only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
