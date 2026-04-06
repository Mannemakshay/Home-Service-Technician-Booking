import API from "./axios";

export const adminLogin = async (credentials) => {
  const response = await API.post("/admin/login", credentials);
  return response.data;
};

export const getDashboardAnalytics = async () => {
  const adminToken = localStorage.getItem("adminToken");
  const response = await API.get("/admin/dashboard", {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return response.data;
};

export const getAllUsers = async (params = {}) => {
  const adminToken = localStorage.getItem("adminToken");
  const response = await API.get("/admin/users", { 
    params,
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const adminToken = localStorage.getItem("adminToken");
  const response = await API.put(`/admin/users/${userId}/status`, 
    { status }, 
    { headers: { Authorization: `Bearer ${adminToken}` }}
  );
  return response.data;
};

export const getAllBookingsAdmin = async (params = {}) => {
  const adminToken = localStorage.getItem("adminToken");
  const response = await API.get("/admin/bookings", { 
    params,
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return response.data;
};

export const getAllReviewsAdmin = async (params = {}) => {
  const adminToken = localStorage.getItem("adminToken");
  const response = await API.get("/admin/reviews", { 
    params,
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  return response.data;
};
