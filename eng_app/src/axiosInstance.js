import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Your API base URL
});

// Intercept every request and attach the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
