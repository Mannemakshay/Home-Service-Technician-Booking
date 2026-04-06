import API from "./axios";

export const loginUser = async (userData) => {
  const response = await API.post("/users/login", userData);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await API.post("/users/register", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/users/logout");
  return response.data;
};
