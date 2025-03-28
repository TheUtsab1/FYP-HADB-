// "use client";

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

// import "./Login.css";
// import useAuthStore from "../../store/useAuthStore";

// const GOOGLE_CLIENT_ID =
//   "219385369763-kgepco7akv2founom70opk4lrfp5o0pd.apps.googleusercontent.com"; // Replace with your actual Client ID

// function Login() {
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // "success" or "error"
//   const navigate = useNavigate();

//   const { setIsUserAuthenticated } = useAuthStore();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://127.0.0.1:8000/login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log(data);

//         // Save both tokens to localStorage
//         localStorage.setItem("access_token", data.access_token);
//         localStorage.setItem("refresh_token", data.refresh_token);

//         setIsUserAuthenticated(true);
//         setMessage("Login successful! Redirecting...");
//         setMessageType("success");
//         setTimeout(() => {
//           navigate("/");
//         }, 1500);
//       } else {
//         setMessage(
//           data.error || "Invalid username or password. Please try again."
//         );
//         setMessageType("error");
//       }
//     } catch (error) {
//       setMessage("Connection error. Please try again later.");
//       setMessageType("error");
//       console.error("Login error:", error);
//     }
//   };

//   const handleGoogleSuccess = async (response) => {
//     const decoded = jwtDecode(response.credential);
//     console.log("Google User:", decoded);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/google-login/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: response.credential }),
//       });

//       const data = await res.json();
//       console.log("Backend Response:", data);

//       if (res.ok) {
//         // Save both tokens to localStorage
//         localStorage.setItem("access_token", data.access_token);
//         localStorage.setItem("refresh_token", data.refresh_token);

//         setIsUserAuthenticated(true);
//         setMessage("Google Login successful! Redirecting...");
//         setMessageType("success");
//         setTimeout(() => {
//           navigate("/");
//         }, 1500);
//       } else {
//         setMessage(data.error || "Google Login failed. Please try again.");
//         setMessageType("error");
//       }
//     } catch (error) {
//       console.error("Google Login error:", error);
//       setMessage("Google Login failed. Please try again.");
//       setMessageType("error");
//     }
//   };

//   return (
//     <div className="app__login">
//       <div className="app__login-overlay">
//         <img src="/placeholder.svg" alt="Background" />
//       </div>
//       <div className="app__login-content">
//         <h2>Welcome Back</h2>

//         {message && (
//           <div className={`app__login-message ${messageType}`}>{message}</div>
//         )}

//         <div className="app__login-social">
//           <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => {
//                 setMessage("Google Login failed. Please try again.");
//                 setMessageType("error");
//               }}
//               // Remove both uxMode and redirectUri props
//               useOneTap
//             />
//           </GoogleOAuthProvider>
//         </div>

//         <div className="app__login-divider">
//           <span>or</span>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <div className="app__login-input-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               placeholder="Enter your username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="app__login-input-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Enter your password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button type="submit">Sign In</button>
//         </form>

//         <div className="app__login-links">
//           <p>
//             Don't have an account? <Link to="/signup">Sign Up</Link>
//           </p>
//           <p>
//             Forgot password? <Link to="/forgot-password">Reset Password</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import useAuthStore from "../../store/useAuthStore";
import googleIcon from "../../assets/google-icon.svg"; // Add this SVG to your assets folder

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const { setIsUserAuthenticated } = useAuthStore();

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
        console.log(data);
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        setIsUserAuthenticated(true);
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
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
    // Implement Google Sign-In logic here
    // This would typically redirect to your OAuth endpoint
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
