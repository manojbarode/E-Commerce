import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Component mount hone par sessionStorage check karo
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (token && savedUser) {
      setLogin(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (token, userData) => {
    // 🔥 Ab hum sessionStorage use kar rahe hain
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));

    setLogin(true);
    setUser(userData);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setLogin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
