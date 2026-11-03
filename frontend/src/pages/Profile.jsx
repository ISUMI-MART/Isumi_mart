import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  // Start from the saved profile, then the logged-in user, then the demo customer
  const [profile, setProfile] = useState(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("customerProfile"));
    } catch {
      saved = null;
    }

    return {
      fullName: saved?.fullName ?? user?.fullName ?? "Nimal Perera",
      phone: saved?.phone ?? user?.phone ?? "071 234 5678",
      email: saved?.email ?? user?.email ?? "nimal@example.com",
      address: saved?.address ?? "No 12, Temple Road, Kadawatha",
    };
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    // TODO (backend): replace with PUT /api/profile
    localStorage.setItem("customerProfile", JSON.stringify(profile));
    alert("Changes saved.");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Customer Profile</h1>

        <div className="profile-layout">
          {/* LEFT CARD */}
          <div className="profile-left-card">
            <div className="avatar">Avatar</div>
            {/* Name and email shown here follow what you type on the right */}
            <h2>{profile.fullName}</h2>
            <p>{profile.email}</p>

            <button className="profile-link-button" onClick={() => navigate("/orders")}>
              My Orders
            </button>
            <button className="profile-link-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* RIGHT CARD */}
          <form className="profile-form-card" onSubmit={handleSave}>
            <div className="profile-grid">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" type="text" name="fullName" value={profile.fullName} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" name="phone" value={profile.phone} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={profile.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="address">Default Delivery Address</label>
                <input id="address" type="text" name="address" value={profile.address} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="green-button save-button">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
