import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "../services/api";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await getProfile();

        setUser(data);

        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          userName: data.userName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error("Profile loading error:", err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        userName: formData.userName,
        phone: formData.phone,
        address: formData.address,
      });

      setUser(updatedUser);

      setFormData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        userName: updatedUser.userName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });

      // Keep Navbar user information updated too
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Profile not found.</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {(user.firstName?.[0] || user.userName?.[0] || "U").toUpperCase()}
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your Isumi Mart account</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="profile-field">
            <label>First Name</label>

            {editing ? (
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            ) : (
              <p>{user.firstName || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Last Name</label>

            {editing ? (
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            ) : (
              <p>{user.lastName || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Username</label>
            {editing ? (
              <input
                name="userName"
                value={formData.userName}
                onChange={handleChange}
              />
            ) : (
              <p>{user.userName || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>

            <p>{user.email || "Not provided"}</p>
          </div>

          <div className="profile-field">
            <label>Address</label>

            {editing ? (
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            ) : (
              <p>{user.address || "Not provided"}</p>
            )}
          </div>

          <div className="profile-field">
            <label>Phone</label>

            {editing ? (
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            ) : (
              <p>{user.phone || "Not provided"}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="profile-actions">
          {editing ? (
            <>
              <button
                className="profile-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                className="profile-cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="profile-edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
