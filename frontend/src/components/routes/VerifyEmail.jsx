// VerifyEmail.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

function VerifyEmail() {
  const [message, setMessage] = useState("Verifying your email...");
  const [messageType, setMessageType] = useState("info");
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Verifying with UID:", uidb64, "Token:", token);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/verify-email/${uidb64}/${token}/`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await response.json();
        console.log("Response:", data);

        if (response.ok) {
          setMessage(data.message);
          setMessageType("success");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setMessage(data.error || "Failed to verify email");
          setMessageType("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("Connection error. Please try again later.");
        setMessageType("error");
      }
    };

    verifyEmail();
  }, [uidb64, token, navigate]);

  return (
    <div className="app__verify-email">
      <div className="app__verify-email-content">
        <h2>Email Verification</h2>
        <div className={`app__verify-email-message ${messageType}`}>
          {message}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
