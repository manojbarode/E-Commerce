import React, { useState, useEffect } from "react";
import "./Css/CategoriesDropdown.css";
import axiosInstance from "../api/axiosConfig"; // Use your axios instance

export default function CategoriesDropdown({ mobile = false, closeDrawer, onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [categories, setCategories] = useState({});
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await axiosInstance.get("/category/with-subcategories"); 
        
        const catObj = {};
        res.data.forEach(cat => {
          catObj[cat.name] = cat.subcategories;
        });

        setCategories(catObj);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    loadData();
  }, []);

  if (!categories || Object.keys(categories).length === 0) return null;

  const handleItemClick = (category, item) => {
    if (onCategorySelect) onCategorySelect({ category, item });
    if (closeDrawer) closeDrawer();
  };

  const toggleMobileCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  if (mobile) {
    return (
      <div className="mobile-category-wrapper">
        {Object.entries(categories).map(([cat, items], index) => (
          <div key={index} className="mobile-category-item">
            <div
              className="mobile-category-header d-flex justify-content-between align-items-center"
              onClick={() => toggleMobileCategory(index)}
            >
              <span className="mobile-cat-title">{cat}</span>
              <i className={`bi bi-chevron-${openCategory === index ? "up" : "down"} mobile-cat-icon`}></i>
            </div>
            <ul className={`mobile-category-list list-unstyled ${openCategory === index ? "open" : ""}`}>
              {items.map((item, i) => (
                <li key={i} className="mobile-cat-item" onClick={() => handleItemClick(cat, item)}>
                  <span className="mobile-cat-bullet">•</span>
                  <span className="mobile-cat-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // ---------- Desktop Mega Menu ----------
  return (
    <div 
      className="premium-dropdown-container"
      onMouseEnter={() => setShowMegaMenu(true)}
      onMouseLeave={() => setShowMegaMenu(false)}
    >
      <div className="premium-dropdown-toggle d-flex align-items-center">
        <span className="me-2">Categories</span>
        <i className={`bi bi-chevron-down toggle-icon ${showMegaMenu ? 'rotate' : ''}`}></i>
      </div>

      <div className={`premium-mega-menu ${showMegaMenu ? 'show' : ''}`}>
        <div className="premium-mega-menu-content">
          {Object.entries(categories).map(([category, items], index) => (
            <div key={index} className="premium-mega-col" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="mega-col-inner">
                <h4 className="mega-col-title mb-3">
                  <span className="title-text">{category}</span>
                  <span className="title-line d-block mt-2"></span>
                </h4>

                <ul className="mega-col-list list-unstyled mb-0">
                  {items.map((item, i) => (
                    <li key={i} className="mega-col-item d-flex align-items-center" onClick={() => handleItemClick(category, item)}>
                      <span className="item-bullet me-2"></span>
                      <span className="item-text">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
