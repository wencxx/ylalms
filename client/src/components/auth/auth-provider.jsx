import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuth, setAuth] = useState(!!localStorage.getItem("token") || false);
  const [currentUser, setCurrentUser] = useState(null);
  const handleLogin = async (credentials) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}api/auth/login`,
        credentials,
        {
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status === 404) throw new Error("User not found");
      if (res.status === 401) throw new Error("Invalid username or password");
      if (res.status !== 200) throw new Error("Unexpected error during login");

      console.log(res.data)

      localStorage.setItem("token", res.data.token);
      setAuth(true);
      setCurrentUser(res.data);
      return res.data.role
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    setCurrentUser(null);
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}api/auth/get-user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status !== 200) {
        handleLogout();
      } else {
        setCurrentUser(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser();
    } else {
      handleLogout();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuth, currentUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
