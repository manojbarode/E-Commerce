import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);

  // Component mount hone par localStorage check karo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setLogin(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setLogin(true);  // State update karo
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogin(false);  // State update karo
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ login, user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};