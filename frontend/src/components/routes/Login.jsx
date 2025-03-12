import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import useAuthStore from "../../store/useAuthStore";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { setIsUserAuthenticated } = useAuthStore();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setMessage("Login successful!");
      navigate("/");
    } else {
      setMessage("Invalid credentials");
    }
  };

  return (
    <div className="app__login">
      <div className="app__login-content">
        <h2>Login</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="app__login-links">
          <p>
            Don't have account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            Forgot password? <Link to="/forgot-password">Reset</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
