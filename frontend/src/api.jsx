// src/api.js
import axios from "axios";

const baseURL = "http://localhost:8000"; // adjust as needed

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const { data } = await axios.post(`${baseURL}/token/refresh/`, {
          refresh,
        });
        localStorage.setItem("access", data.access);
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
