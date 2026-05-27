import api from "./axios";

// Book appointment
export const bookAppointment = async (data) => {
  const token = localStorage.getItem("token");

  const res = await api.post("/appointments", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// My appointments
export const getMyAppointments = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get("/appointments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};