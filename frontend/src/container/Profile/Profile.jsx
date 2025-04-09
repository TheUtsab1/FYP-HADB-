"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: ""
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
      // With ModelViewSet, we use PATCH to update partial data
      const response = await fetch(`http://127.0.0.1:8000/profile/${user.id}/`, {
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
      });
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      
      const updatedData = await response.json();
      
      // Update the local user state and show success message
      setUser(updatedData);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      
      // Refresh the profile data from the server
      fetchUserProfile();
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="app__profile">
        <div className="app__profile-content">
          <div className="app__profile-loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app__profile">
      <div className="app__profile-overlay">
        <img src="/placeholder.svg?height=1080&width=1920" alt="Background" />
      </div>

      <div className="app__profile-content">
        <h2>User Profile</h2>

        {message.text && (
          <div className={`app__profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {isEditing ? (
          <form className="app__profile-form" onSubmit={handleSubmit}>
            <div className="app__profile-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="app__profile-field">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            <div className="app__profile-field">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <div className="app__profile-field">
              <label htmlFor="email">Email (Read-only)</label>
              <p>{user.email}</p>
            </div>

            <div className="app__profile-actions">
              <button type="submit" className="app__profile-save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="app__profile-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="app__profile-form">
              <div className="app__profile-field">
                <label>Username</label>
                <p>{user.username}</p>
              </div>

              <div className="app__profile-field">
                <label>Full Name</label>
                <p>
                  {user.first_name} {user.last_name}
                </p>
              </div>

              <div className="app__profile-field">
                <label>Email</label>
                <p>{user.email}</p>
              </div>

              <div className="app__profile-actions">
                <button className="app__profile-edit-btn" onClick={handleEdit}>
                  Edit Profile
                </button>
              </div>
            </div>
          </>
        )}

        <div className="app__profile-links" style={{ marginTop: "1rem" }}>
          <a onClick={handleGoBack} style={{ cursor: "pointer" }}>
            Go Back
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;