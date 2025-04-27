"use client";

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import useAuthStore from "../../store/useAuthStore";
import googleIcon from "../../assets/google-icon.svg";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const { isUserAuthenticated, setIsUserAuthenticated } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (isUserAuthenticated) {
      navigate("/");
    }
  }, [isUserAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        setIsUserAuthenticated(true);

        setMessage("Login successful! Redirecting to homepage...");
        setMessageType("success");

        setTimeout(() => {
          navigate("/");
        }, 3000); // 3 seconds is perfect!
      } else {
        setMessage("Invalid username or password. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Connection error. Please try again later.");
      setMessageType("error");
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In clicked");
    setMessage("Google Sign-In feature coming soon!");
    setMessageType("info");
  };

  return (
    <div className="app__login">
      <div className="app__login-overlay">
        <img src="/placeholder.svg" alt="Background" />
      </div>
      <div className="app__login-content">
        <h2>Welcome Back</h2>

        {message && (
          <div className={`app__login-message ${messageType}`}>{message}</div>
        )}

        <div className="app__login-social">
          <button
            type="button"
            className="app__login-google"
            onClick={handleGoogleSignIn}
          >
            <img src={googleIcon || "/placeholder.svg"} alt="Google" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="app__login-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="app__login-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="app__login-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign In</button>
        </form>

        <div className="app__login-links">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            Forgot password? <Link to="/forgot-password">Reset Password</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
