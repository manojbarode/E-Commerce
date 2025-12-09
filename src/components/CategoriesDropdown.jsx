import React, { useState, useEffect } from "react";
import "./Css/CategoriesDropdown.css";
import { getCategories, getSubcategories } from "../api/categoriesApi";

export default function CategoriesDropdown({ mobile = false, closeDrawer, onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);
  const [categories, setCategories] = useState({});
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  useEffect(() => {
    // Mock data for demonstration - Replace with your API calls
    // const mockCategories = {
    //   "Electronics": ["Mobile Phones", "Laptops", "Earphones / Headphones", "Smart Watches", "Tablets", "Cameras"],
    //   "Clothes / Fashion": ["Male", "Female", "Kids", "Accessories", "Winter Collection"],
    //   "Shoes": ["Men", "Women", "Kids", "Sports Shoes", "Formal Shoes"],
    //   "Beauty & Personal Care": ["Skincare", "Haircare", "Makeup", "Fragrance", "Male Skincare", "Female Skincare", "Kids Skincare", "Male Grooming"],
    //   "Books & Stationery": ["Books", "Stationery", "Fiction", "Non-Fiction", "Educational / Textbooks"],
    //   "Home & Kitchen": ["Kitchen Appliances", "Home Decor", "Furniture", "Bedding & Linen"],
    //   "Sports & Outdoors": ["Fitness Equipment", "Outdoor Gear", "Sports Accessories"],
    //   "Toys & Baby Products": ["Baby Clothing", "Toys", "Baby Care Products"]
    // };
    
    // setCategories(mockCategories);

    // Uncomment below code and remove mock data when using real API
    async function loadData() {
      try {
        const res = await getCategories();
        const catObj = {};
        for (const cat of res) {
          const subRes = await getSubcategories(cat.id);
          catObj[cat.name] = subRes.map(s => s.name);
        }
        setCategories(catObj);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    loadData();
  }, []);

  if (!categories || Object.keys(categories).length === 0) return null;

  const handleItemClick = (category, item) => {
    if (onCategorySelect) {
      onCategorySelect({ category, item });
    }
    if (closeDrawer) {
      closeDrawer();
    }
  };

  const toggleMobileCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  // ---------- Mobile Accordion ----------
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
                <li 
                  key={i} 
                  className="mobile-cat-item"
                  onClick={() => handleItemClick(cat, item)}
                >
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
      <div 
        key={index} 
        className="premium-mega-col"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="mega-col-inner">
          <h4 className="mega-col-title mb-3">
            <span className="title-text">{category}</span>
            <span className="title-line d-block mt-2"></span>
          </h4>

          <ul className="mega-col-list list-unstyled mb-0">
            {items.map((item, i) => (
              <li 
                key={i} 
                className="mega-col-item d-flex align-items-center"
                onClick={() => handleItemClick(category, item)}
              >
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