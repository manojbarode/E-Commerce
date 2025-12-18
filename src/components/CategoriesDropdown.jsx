import React, { useState, useEffect } from "react";
import "./Css/CategoriesDropdown.css";

export default function CategoriesDropdown({ categories = [], mobile = false, closeDrawer, onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  // Array => Object conversion for easier access
  const categoriesObj = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.subcategories || [];
    return acc;
  }, {});

  if (!categoriesObj || Object.keys(categoriesObj).length === 0) return null;

  const handleItemClick = (categoryName, item) => {
    if (onCategorySelect) onCategorySelect({ category: categoryName, subcategory: item });
    if (closeDrawer) closeDrawer();
  };

  const toggleMobileCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  // ---------- MOBILE ----------
  if (mobile) {
    return (
      <div className="mobile-category-wrapper">
        {Object.entries(categoriesObj).map(([categoryName, items], index) => (
          <div key={index} className="mobile-category-item">
            <div
              className="mobile-category-header d-flex justify-content-between align-items-center"
              onClick={() => toggleMobileCategory(index)}
            >
              <span className="mobile-cat-title">{categoryName}</span>
              <i className={`bi bi-chevron-${openCategory === index ? "up" : "down"} mobile-cat-icon`}></i>
            </div>
            <ul className={`mobile-category-list list-unstyled ${openCategory === index ? "open" : ""}`}>
              {items.map((item, i) => (
                <li key={i} className="mobile-cat-item" onClick={() => handleItemClick(categoryName, item)}>
                  <span className="mobile-cat-bullet">•</span>
                  <span className="mobile-cat-text">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // ---------- DESKTOP MEGA MENU ----------
  return (
    <div
      className="premium-dropdown-container"
      onMouseEnter={() => setShowMegaMenu(true)}
      onMouseLeave={() => setShowMegaMenu(false)}
    >
      <div className="premium-dropdown-toggle d-flex align-items-center">
        <span className="me-2">Categories</span>
        <i className={`bi bi-chevron-down toggle-icon ${showMegaMenu ? "rotate" : ""}`}></i>
      </div>

      <div className={`premium-mega-menu ${showMegaMenu ? "show" : ""}`}>
        <div className="premium-mega-menu-content">
          {Object.entries(categoriesObj).map(([categoryName, items], index) => (
            <div key={index} className="premium-mega-col" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="mega-col-inner">
                <h4 className="mega-col-title mb-3">
                  <span className="title-text">{categoryName}</span>
                  <span className="title-line d-block mt-2"></span>
                </h4>

                {items.length > 0 && (
                  <ul className="mega-col-list list-unstyled mb-0">
                    {items.map((item, i) => (
                      <li key={i} className="mega-col-item d-flex align-items-center" onClick={() => handleItemClick(categoryName, item)}>
                        <span className="item-bullet me-2"></span>
                        <span className="item-text">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
