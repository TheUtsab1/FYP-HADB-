"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import useNavigate
import api from "../../api";
import "./VerifyEmail.css";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate(); // ⬅️ Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/verify/", { email, code });
      setMessage(res.data.message);
      setMessageType("success");

      // Redirect to login after a short delay (e.g., 2 seconds)
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "Verification failed");
      setMessageType("error");
    }
  };

  return (
    <div className="app__verify">
      <div className="app__verify-overlay">
        <img
          src="/placeholder.svg?height=800&width=1200"
          alt="Background pattern"
        />
      </div>
      <div className="app__verify-content">
        <h2>Verify Email</h2>

        {message && (
          <div className={`app__verify-message ${messageType}`}>{message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="app__verify-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="app__verify-input-group">
            <label htmlFor="code">Verification Code</label>
            <input
              id="code"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button type="submit">Verify</button>
        </form>

        <div className="app__verify-links">
          <p>
            Didn't receive a code? <a href="#">Resend Code</a>
          </p>
          <p>
            Return to <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
