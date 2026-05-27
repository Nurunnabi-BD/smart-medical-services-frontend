import { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Logout action
  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  // Load user profile on mount or token change
  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/auth/profile");
          setUser(res.data);
        } catch (err) {
          console.error("Failed to load user profile:", err);
          logout();
        }
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
      setLoading(false);
    };
    loadProfile();
  }, [token]);

  // Login action
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem("token", userToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      setToken(userToken);
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || "Invalid credentials";
    }
  };

  // Register action
  const register = async (data) => {
    setLoading(true);
    try {
      let res;
      if (data.role === "doctor") {
        // Registers in user and doctor collection
        res = await api.post("/doctors/register", data);
      } else {
        // Patient registration
        res = await api.post("/auth/register", {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || "patient",
        });
      }
      
      const { token: userToken, ...userData } = res.data;

      // Auto login after registration
      localStorage.setItem("token", userToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      setToken(userToken);
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || "Registration failed";
    }
  };

  // Update Profile action
  const updateProfile = async (data) => {
    setLoading(true);
    try {
      let res;
      if (user.role === "doctor") {
        res = await api.put("/doctors/profile", data);
        // Sync doctor profile updates back to general user details
        setUser((prev) => ({
          ...prev,
          name: res.data.name || prev.name,
          doctorProfile: res.data,
        }));
      } else {
        res = await api.put("/auth/profile", data);
        setUser(res.data);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || "Profile update failed";
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
