import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Adjust to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout to help detect network issues earlier
});

// Request logging (developer-only)
api.interceptors.request.use(
  (config) => {
    // console.debug(`[api] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (err) => Promise.reject(err)
);

// Response / error handling: make network errors clearer in console
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[api] Request timed out:', error.config && `${error.config.method.toUpperCase()} ${error.config.url}`);
    } else if (!error.response) {
      // network error (no response received)
      console.error('[api] Network error / failed to fetch:', error.config && `${error.config.method.toUpperCase()} ${error.config.url}`, error.message);
    } else {
      console.error('[api] Server error:', error.response.status, error.config && `${error.config.method.toUpperCase()} ${error.config.url}`);
    }
    return Promise.reject(error);
  }
);

export default api;
