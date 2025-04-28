// ForgotPassword.js
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/password/reset/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        setMessageType("success");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Connection error. Please try again later.");
      setMessageType("error");
      console.error("Forgot Password error:", error);
    }
  };

  return (
    <div className="app__forgot-password">
      <div className="app__forgot-password-content">
        <h2>Reset Your Password</h2>

        {message && (
          <div className={`app__forgot-password-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="app__forgot-password-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
