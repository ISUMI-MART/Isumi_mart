import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO (backend): send the form to POST /api/auth/register.
    // Never save the password in localStorage - only keep the profile details.
    const profile = {
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      address: "",
    };

    localStorage.setItem("customerProfile", JSON.stringify(profile));
    onLogin({ fullName: form.fullName, phone: form.phone, email: form.email });

    navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Customer Registration</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" name="fullName" type="text" value={form.fullName} onChange={handleChange} required />

          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />

          <button type="submit" className="auth-button">Register</button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
