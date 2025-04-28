// ResetPassword.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css"; 

function ResetPassword() {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/auth/password/reset/confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.error || "Invalid or expired link. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Connection error. Please try again later.");
      setMessageType("error");
      console.error("Reset Password error:", error);
    }
  };

  return (
    <div className="app__reset-password">
      <div className="app__reset-password-content">
        <h2>Set New Password</h2>

        {message && (
          <div className={`app__reset-password-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="app__reset-password-input-group">
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="app__reset-password-input-group">
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
