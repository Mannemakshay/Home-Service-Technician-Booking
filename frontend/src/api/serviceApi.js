import API from "./axios";

export const getServices = async () => {
  const response = await API.get("/services");
  return response.data;
};
