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

export default function CategoriesDropdown({ mobile = false, closeDrawer }) {
  const [openCategory, setOpenCategory] = useState(null);

  if (mobile) {
    return (
      <div className="mobile-category">
        {Object.entries(categories).map(([cat, items], index) => (
          <div key={index} className="mobile-category-item">
            
            {/* Category title */}
            <div
              className="mobile-category-header"
              onClick={() => setOpenCategory(openCategory === index ? null : index)}
            >
              <span>{cat}</span>
              <i className={`bi bi-chevron-${openCategory === index ? "up" : "down"}`}></i>
            </div>

            {/* Sub-Category Links */}
            {openCategory === index && (
              <ul className="mobile-category-list">
                {items.map((item, i) => (
                  <li key={i}>
                    <Link
                      to={`/products/${item.toLowerCase().replace(/\s/g, "-")}`}
                      className="mobile-category-link"
                      onClick={closeDrawer} // 👈 क्लिक पर ड्रावर बंद करें
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

  // DESKTOP VERSION (Mega Menu)
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