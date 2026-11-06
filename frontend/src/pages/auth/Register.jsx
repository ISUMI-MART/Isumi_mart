
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { registerCustomer } from "../../services/authService";
// import "../Auth.css";

// function Register() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     userName: "",
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

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
//       await registerCustomer(formData);
//       navigate("/login", {
//         state: { message: "Account created successfully. Please log in." },
//       });
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
//           <h1>Create Account</h1>
//           <p className="auth-subtitle">
//             Sign up to start shopping with Isumi Mart.
//           </p>

//           {error && <div className="auth-error">{error}</div>}

//           <form onSubmit={handleSubmit}>
//             <div className="auth-form-row">
//               <div className="auth-field">
//                 <label>First Name</label>
//                 <input
//                   type="text"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="Enter first name"
//                   required
//                 />
//               </div>

//               <div className="auth-field">
//                 <label>Last Name</label>
//                 <input
//                   type="text"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Enter last name"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="auth-field">
//               <label>Username</label>
//               <input
//                 type="text"
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 placeholder="Choose a username"
//                 required
//               />
//             </div>

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
//                 placeholder="At least 8 characters"
//                 minLength={8}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="auth-submit"
//               disabled={loading}
//             >
//               {loading ? "Creating Account..." : "Create Account"}
//             </button>
//           </form>

//           <p className="auth-switch">
//             Already have an account? <Link to="/login">Log in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/authService";
import "../Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      await registerCustomer(formData);

      navigate("/login", {
        state: {
          message: "Account created successfully. Please log in.",
        },
      });
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

      {/* Right Register Panel */}
      <div className="auth-right-panel">
        <div className="auth-form-container register-form">
          <span className="auth-portal-label">CUSTOMER PORTAL</span>

          <h1>Create your account</h1>

          <p className="auth-subtitle">
            Join Isumi Mart and start shopping fresh.
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="firstName">First name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="lastName">Last name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="userName">Username *</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-form-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>

            <div className="auth-divider"></div>

            <p className="auth-checkout-note">
              Fresh essentials. Friendly service. Every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
