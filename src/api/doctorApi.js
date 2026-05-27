import api from "./axios";

// Get all doctors
export const getDoctors = async () => {
  const res = await api.get("/doctors");
  return res.data;
};

// Register doctor
export const registerDoctor = async (data) => {
  const res = await api.post("/doctors/register", data);
  return res.data;
};