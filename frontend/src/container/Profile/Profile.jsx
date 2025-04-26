"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const fetchUserProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:8000/profile/", {
      headers: {
        Authorization: `JWT ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((data) => {
        // For DRF viewsets with pagination, check if results exist
        const userData = Array.isArray(data.results) ? data.results[0] : data;
        setUser(userData);
        setFormData({
          username: userData.username || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile error:", err);
        navigate("/login");
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/profile/${user.id}/`, // Ensure this matches your API endpoint
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile");
      }

      const updatedData = await response.json();

      // Update the local user state and show success message
      setUser(updatedData);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    if (user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    return user.username.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="app__profile">
        <div className="app__profile-overlay">
          <img src="/placeholder.svg?height=1080&width=1920" alt="Background" />
        </div>
        <div className="profile-loading-card">
          <div className="profile-loading-content">
            <div className="profile-loading-spinner"></div>
            <p className="profile-loading-text">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app__profile">
      <div className="app__profile-overlay">
        <img src="/placeholder.svg?height=1080&width=1920" alt="Background" />
      </div>

      <div className="profile-wrapper">
        <button className="profile-back-button" onClick={handleGoBack}>
          <svg
            className="profile-back-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="app__profile-content">
          <div className="profile-header-top">
            <div className="profile-badges">
              <span className="profile-badge">Profile</span>
              {user?.username && (
                <span className="username-badge">@{user.username}</span>
              )}
            </div>
            {!isEditing && (
              <button className="profile-edit-icon-button" onClick={handleEdit}>
                <svg
                  className="profile-edit-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                <span className="sr-only">Edit profile</span>
              </button>
            )}
          </div>

          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <div className="profile-avatar-fallback">{getInitials()}</div>
            </div>
            <h2>User Profile</h2>
          </div>

          {message.text && (
            <div className={`app__profile-message ${message.type}`}>
              <p>{message.text}</p>
            </div>
          )}

          {isEditing ? (
            <form className="app__profile-form" onSubmit={handleSubmit}>
              <div className="app__profile-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="app__profile-field">
                <label htmlFor="first_name">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>

              <div className="app__profile-field">
                <label htmlFor="last_name">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="app__profile-field">
                <label htmlFor="email">Email (Read-only)</label>
                <p>{user?.email}</p>
              </div>

              <div className="app__profile-actions">
                <button type="submit" className="app__profile-save-btn">
                  <svg
                    className="button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="app__profile-cancel-btn"
                  onClick={handleCancel}
                >
                  <svg
                    className="button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="profile-info-card">
                <div className="profile-info-header">
                  <svg
                    className="profile-info-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Account Information
                </div>
                <hr className="profile-info-separator" />

                <div className="profile-info-fields">
                  <div className="app__profile-field">
                    <label>Username</label>
                    <p>{user?.username}</p>
                  </div>

                  <div className="app__profile-field">
                    <label>Full Name</label>
                    <p>
                      {user?.first_name || user?.last_name
                        ? `${user.first_name} ${user.last_name}`.trim()
                        : "Not provided"}
                    </p>
                  </div>

                  <div className="app__profile-field">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="app__profile-actions">
                <button onClick={handleEdit} className="app__profile-edit-btn">
                  <svg
                    className="button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          <div className="app__profile-links">
            <a onClick={handleGoBack} style={{ cursor: "pointer" }}>
              Go Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
