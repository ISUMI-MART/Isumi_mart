import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../services/authService";
import "../../Layouts/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ?<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye preview-icon"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off preview-icon"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>}
                </button>
              </div>
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
