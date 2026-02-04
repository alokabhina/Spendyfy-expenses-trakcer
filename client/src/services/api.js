import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor to add Clerk auth token
api.interceptors.request.use(
  async (config) => {
    try {
      // ✅ Wait until Clerk is fully loaded
      if (window.Clerk) {
        // getToken() works only when session exists
        const token = await window.Clerk.session?.getToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error attaching Clerk token:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message || "An error occurred";

      if (error.response.status === 401) {
        console.error("Authentication Error - Please sign in again");
      }

      console.error("API Error:", message);
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error("Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    } else {
      console.error("Error:", error.message);
      return Promise.reject(error);
    }
  }
);
console.log("✅ BASE URL =", API_URL);

export default api;
