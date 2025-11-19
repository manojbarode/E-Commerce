import React from "react";
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

export default function CategoriesDropdown() {
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
    className={`dropdown-item item-${i}`}
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
