import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const saveUser = (userData) => {
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUserInfo(userData);
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password,
    });

    saveUser(data);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", {
      email,
      password,
    });

    saveUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        user: userInfo,
        saveUser,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};