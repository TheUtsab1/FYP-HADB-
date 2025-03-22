"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./Signup.css"

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    email: "",
    password1: "",
    password2: "",
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" or "error"
  const [passwordStrength, setPasswordStrength] = useState("") // "weak", "medium", "strong"

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear specific field error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }

    // Check password strength
    if (name === "password1") {
      checkPasswordStrength(value)
    }

    // Check if passwords match
    if (name === "password2") {
      if (value !== formData.password1) {
        setErrors({
          ...errors,
          password2: "Passwords do not match",
        })
      } else {
        setErrors({
          ...errors,
          password2: "",
        })
      }
    }
  }

  const checkPasswordStrength = (password) => {
    // Simple password strength check
    if (password.length < 6) {
      setPasswordStrength("weak")
    } else if (password.length < 10) {
      setPasswordStrength("medium")
    } else {
      setPasswordStrength("strong")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (formData.password1.length < 6) {
      newErrors.password1 = "Password must be at least 6 characters"
    }

    // Confirm password
    if (formData.password1 !== formData.password2) {
      newErrors.password2 = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      setMessage("Please fix the errors in the form")
      setMessageType("error")
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage("Account created successfully! Redirecting to login...")
        setMessageType("success")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setMessage(data.error || "An error occurred during signup")
        setMessageType("error")

        // Handle specific field errors if returned from API
        if (data.fieldErrors) {
          setErrors(data.fieldErrors)
        }
      }
    } catch (error) {
      console.error("Signup error:", error)
      setMessage("Connection error. Please try again later.")
      setMessageType("error")
    }
  }

  return (
    <div className="app__signup">
      <div className="app__signup-overlay">
        <img src="/placeholder.svg" alt="Background" />
      </div>
      <div className="app__signup-content">
        <h2>Create Account</h2>

        {message && <div className={`app__signup-message ${messageType}`}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="app__signup-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              required
            />
            {errors.username && <span className="input-error-message">{errors.username}</span>}
          </div>

          <div className="app__signup-form-row">
            <div className="app__signup-input-group">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                id="fname"
                name="fname"
                placeholder="First name"
                value={formData.fname}
                onChange={handleChange}
                className={errors.fname ? "error" : ""}
                required
              />
              {errors.fname && <span className="input-error-message">{errors.fname}</span>}
            </div>

            <div className="app__signup-input-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                id="lname"
                name="lname"
                placeholder="Last name"
                value={formData.lname}
                onChange={handleChange}
                className={errors.lname ? "error" : ""}
                required
              />
              {errors.lname && <span className="input-error-message">{errors.lname}</span>}
            </div>
          </div>

          <div className="app__signup-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              required
            />
            {errors.email && <span className="input-error-message">{errors.email}</span>}
          </div>

          <div className="app__signup-input-group">
            <label htmlFor="password1">Password</label>
            <input
              type="password"
              id="password1"
              name="password1"
              placeholder="Create a password"
              value={formData.password1}
              onChange={handleChange}
              className={errors.password1 ? "error" : ""}
              required
            />
            {passwordStrength && (
              <div className="password-strength">
                <div className={`password-strength-bar ${passwordStrength}`}></div>
              </div>
            )}
            {errors.password1 && <span className="input-error-message">{errors.password1}</span>}
          </div>

          <div className="app__signup-input-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              placeholder="Confirm your password"
              value={formData.password2}
              onChange={handleChange}
              className={errors.password2 ? "error" : ""}
              required
            />
            {errors.password2 && <span className="input-error-message">{errors.password2}</span>}
          </div>

          <button type="submit">Create Account</button>
        </form>

        <div className="app__signup-links">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

