import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);

  // When app loads → check if user is logged in (from sessionStorage)
  useEffect(() => {
    const savedLogin = sessionStorage.getItem("isLoggedIn") === "true";
    setLogin(savedLogin);
  }, []);

  // Login function
  const loginUser = () => {
    sessionStorage.setItem("isLoggedIn", "true"); // store in sessionStorage
    setLogin(true);
  };

  // Logout function
  const logoutUser = () => {
    sessionStorage.removeItem("isLoggedIn");
    setLogin(false);
  };

  return (
    <AuthContext.Provider value={{ login, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
