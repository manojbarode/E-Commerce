import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Css/Navbar.css'
import CategoriesDropdown from "./CategoriesDropdown";
import Login from "../pages/Login";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="navbar navbar-expand-md bg-white shadow custom-navbar px-3 py-2 rounded-bottom-4">
        <div className="container-fluid">

          {/* LOGO */}
          <span className="navbar-brand fs-2 fw-bold text-primary">eShop</span>

          {/* RIGHT ICONS (MOBILE) */}
          <div className="d-flex d-md-none gap-3 fs-4">
            <i className="bi bi-search"></i>
            <Link to="/cart" className="text-dark"><i className="bi bi-cart"></i></Link>
            <i className="bi bi-list fs-1" onClick={() => setOpen(true)}></i>
          </div>

          {/* NAV ITEMS + SEARCH + ICONS */}
          <div className="collapse navbar-collapse">

            {/* NAV ITEMS */}
            <ul className="navbar-nav gap-4 mx-auto d-none d-md-flex">
              <li><Link to="/" className="nav-link custom-nav">Home</Link></li>
              {/* <li><Link to="/products" className="nav-link custom-nav">Categories</Link></li> */}
              <CategoriesDropdown/>
              <li><Link to="/offers" className="nav-link custom-nav">Offers</Link></li>
              <li><Link to="/seller" className="nav-link custom-nav">Seller</Link></li>
              <li><Link to="/help" className="nav-link custom-nav">Help</Link></li>
            </ul>

            {/* SEARCH BAR */}
            <div className="search-box d-none d-md-flex ms-auto">
              <i className="bi bi-search me-2"></i>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search for products, brands..."
              />
            </div>

            {/* DESKTOP ICONS */}
            <div className="d-none d-md-flex gap-3 fs-4 ms-4">
              <Link to="/wishlist" className="text-primary"><i className="bi bi-heart-fill"></i></Link>
              <Link to="/cart" className="text-primary"><i className="bi bi-cart-fill"></i></Link>
              <Link to="/profile" className="text-primary"><i className="bi bi-person-circle"><Login/></i></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* DRAWER (Mobile) */}
      <div className={`custom-drawer ${open ? "show" : ""}`}>
        <div className="drawer-header">
          <span className="fw-bold fs-4">Menu</span>
          <i className="bi bi-x-lg fs-3" onClick={() => setOpen(false)}></i>
        </div>

        <div className="drawer-body">

          {/* Search */}
          <div className="search-box w-100 mb-3">
            <i className="bi bi-search me-2"></i>
            <input className="form-control border-0" placeholder="Search..." />
          </div>

          <ul className="navbar-nav gap-4 mx-auto d-flex flex-column">
  <li className="nav-item">
    <Link to="/" className="nav-link custom-nav">Home</Link>
  </li>

  <CategoriesDropdown mobile={true} />


  <li className="nav-item">
    <Link to="/offers" className="nav-link custom-nav">Offers</Link>
  </li>

  <li className="nav-item">
    <Link to="/seller" className="nav-link custom-nav">Seller</Link>
  </li>

  <li className="nav-item">
    <Link to="/help" className="nav-link custom-nav">Help</Link>
  </li>
</ul>





          <hr />

          {/* Drawer Icons */}
          <div className="d-flex justify-content-around fs-1 mt-3">
            <i className="bi bi-heart-fill"></i>
            <i className="bi bi-cart-fill"></i>
            <i className="bi bi-person-circle"></i>
          </div>
        </div>
      </div>
    </>
  );
}
