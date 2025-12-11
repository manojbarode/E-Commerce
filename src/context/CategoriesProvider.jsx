import { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosConfig";

export const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Apna backend URL yahan replace karein
        const response = await axiosInstance.get("/categories");
        setCategories(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency - sirf ek baar fetch hoga

  // Manual refresh function (optional)
  const refreshCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/categories");
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error("Error refreshing categories:", error);
      setError("Failed to refresh categories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider 
      value={{ 
        categories, 
        loading, 
        error,
        refreshCategories 
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};