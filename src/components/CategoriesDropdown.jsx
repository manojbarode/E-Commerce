import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Css/CategoriesDropdown.css";

const categories = {
  "Clothes": ["Men's Wear", "Women's Wear", "Kids", "Accessories"],
  "Shoes": ["Men's Shoes", "Women's Shoes", "Kids Shoes", "Accessories"],
  "Electronics": ["Mobile & Accessories", "Computers & Accessories", "Audio & Video", "Home Appliances", "Gaming"],
  "Home & Kitchen": ["Furniture", "Decor", "Cookware"],
  "Books & Stationery": ["Books", "Notebooks", "Pens"],
  "Beauty & Personal Care": ["Skincare", "Makeup", "Haircare"],
  "Sports & Outdoors": ["Fitness", "Sportswear", "Camping"]
};

export default function CategoriesDropdown({ mobile = false, closeDrawer, onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);

  if (mobile) {
    return (
      <div className="mobile-category">
        {Object.entries(categories).map(([cat, items], index) => (
          <div key={index} className="mobile-category-item">
            <div
              className="mobile-category-header"
              onClick={() => setOpenCategory(openCategory === index ? null : index)}
            >
              <span>{cat}</span>
              <i className={`bi bi-chevron-${openCategory === index ? "up" : "down"}`}></i>
            </div>

            {openCategory === index && (
              <ul className="mobile-category-list">
                {items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={`/products/${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="mobile-category-link"
                      onClick={() => {
                        if (closeDrawer) closeDrawer();
                        if (onCategorySelect) onCategorySelect(item);
                      }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="dropdown-container">
      <div className="dropdown-toggle text-secondary">Categories</div>
      <div className="mega-menu">
        {Object.entries(categories).map(([category, items], index) => (
          <div key={index} className="category-column">
            <h6>{category}</h6>
            <ul>
              {items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={`/products/${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="dropdown-item"
                    onClick={() => onCategorySelect && onCategorySelect(item)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
