import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Adjust to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add request/response interceptors if needed
// api.interceptors.request.use(...);
// api.interceptors.response.use(...);

export default api;
