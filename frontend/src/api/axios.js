import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add token automatically for user routes
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  } else if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  }
  
  return req;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default API;
