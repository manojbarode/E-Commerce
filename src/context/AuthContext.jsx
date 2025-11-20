import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn") === "true";
    setLogin(savedLogin);
  }, []);

  const loginUser = () => {
    localStorage.setItem("isLoggedIn", "true");
    setLogin(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("isLoggedIn");
    setLogin(false);
  };

  return (
    <AuthContext.Provider value={{ login, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
