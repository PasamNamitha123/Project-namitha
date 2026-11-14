
import api from "./axios";

export const getApplications = async (params) => {
  const response = await api.get("/applications", { params });
  return response.data;
};

export const createApplication = async (data) => {
  const response = await api.post("/applications", data);
  return response.data;
};

export const updateApplication = async (id, data) => {
  const response = await api.patch(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};
