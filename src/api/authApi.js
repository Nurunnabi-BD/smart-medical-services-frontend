import api from "./axios";

// Register
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);

  // token save (safe check)
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

// Get Profile (protected)
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const res = await api.get("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};