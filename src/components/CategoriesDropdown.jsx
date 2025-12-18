import React, { useState, useEffect } from "react";
import "./Css/CategoriesDropdown.css";

export default function CategoriesDropdown({ categories = [], mobile = false, closeDrawer, onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
 const [categoriesObj, setCategoriesObj] = useState({});

useEffect(() => {
  const obj = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.subcategories || [];
    return acc;
  }, {});
  setCategoriesObj(obj);
}, [categories]);
console.log("Desktop Categories: ", categoriesObj);


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
    {Object.entries(categoriesObj).map(([categoryName, items]) => (
  <div
    key={categoryName}
    className="premium-mega-col"
    style={{ animationDelay: `${Math.random() * 0.1}s` }}
  >
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
