import API from "./axios";

export const getTechnicians = async (skill) => {
  const query = skill ? `?skill=${encodeURIComponent(skill)}` : '';
  const response = await API.get(`/technicians${query}`);
  return response.data;
};

export const addTechnician = async (technicianData) => {
  const response = await API.post("/technicians/add", technicianData);
  return response.data;
};

export const deleteTechnician = async (id) => {
  const response = await API.delete(`/technicians/${id}`);
  return response.data;
};
