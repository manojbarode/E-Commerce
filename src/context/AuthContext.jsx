import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    setLogin(true);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

