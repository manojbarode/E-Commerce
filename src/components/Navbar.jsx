import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Redux/authSlice";
import CategoriesDropdown from "./CategoriesDropdown";
import { getCategories } from "../api/categoriesApi";
import "./Css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategories();
        const catObj = {};
        res.forEach(cat => {
          catObj[cat.name] = cat.subcategories || [];
        });
        setCategories(catObj);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleProfileClick = () => {
    isLoggedIn ? navigate("/profile") : navigate("/signup");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* MAIN NAV */}
      <nav className="premium-navbar navbar navbar-expand-lg sticky-top">
        <div className="container-fluid px-4">
          {/* Logo */}
          <span className="premium-logo" onClick={() => navigate("/")}>
            eShop
          </span>

          {/* Mobile Search */}
          <div className="premium-search-box premium-mobile-search-inline-permanent d-lg-none">
            <i className="bi bi-search"></i>
            <input 
              type="search" 
              placeholder="Search products..." 
              className="premium-search-input" 
            />
          </div>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="premium-nav-link nav-link-home" to="/">
                  <i className="bi bi-house-door me-2"></i>Home
                </Link>
              </li>

              {/* Desktop Categories */}
              <li className="nav-item text-warning">
                <CategoriesDropdown categories={categories} />
              </li>

              <li className="nav-item">
                <Link className="premium-nav-link nav-link-offers" to="/offers">
                  <i className="bi bi-tag me-2"></i>Offers
                </Link>
              </li>

              <li className="nav-item">
                <Link className="premium-nav-link nav-link-seller" to="/Addseller">
                  <i className="bi bi-shop me-2"></i>Seller
                </Link>
              </li>

              <li className="nav-item">
                <Link className="premium-nav-link nav-link-help" to="/help">
                  <i className="bi bi-question-circle me-2"></i>Help
                </Link>
              </li>
            </ul>

            {/* Desktop Search */}
            <div className="premium-search-box search-desktop d-none d-lg-flex">
              <i className="bi bi-search"></i>
              <input type="search" placeholder="Search products..." className="premium-search-input" />
            </div>

            {/* Desktop Icons */}
            <div className="premium-nav-icons d-none d-lg-flex">
              <Link to="/wishlist" className="premium-icon-btn icon-wishlist">
                <i className="bi bi-heart"></i>
                <span className="icon-badge">3</span>
              </Link>

              <Link to="/cart" className="premium-icon-btn icon-cart">
                <i className="bi bi-cart3"></i>
                <span className="icon-badge">5</span>
              </Link>

              {isLoggedIn ? (
                <>
                  <div className="premium-icon-btn icon-profile" onClick={handleProfileClick}>
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <button className="premium-logout-btn btn-logout" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <button className="premium-signup-btn btn-signup" onClick={() => navigate("/signup")}>
                  Sign Up
                </button>
              )}
            </div>
          </div>

          {/* Mobile Icons */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            {isLoggedIn ? (
              <div className="premium-mobile-login-btn" onClick={handleProfileClick}>
                <i className="bi bi-person-circle"></i>
              </div>
            ) : (
              <button className="premium-mobile-login" onClick={() => navigate("/signup")}>
                <i className="bi bi-box-arrow-in-right"></i>
              </button>
            )}

            <button className="premium-mobile-toggle" onClick={() => setDrawerOpen(true)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <div className={`premium-drawer ${drawerOpen ? "show" : ""}`}>
        <div className="premium-drawer-header">
          <h4>Menu</h4>
          <button className="premium-drawer-close" onClick={closeDrawer}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="premium-drawer-content">
          <Link to="/" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-house-door"></i> Home
          </Link>

          <Link to="/wishlist" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-heart"></i> Wishlist <span className="drawer-badge">3</span>
          </Link>

          <Link to="/cart" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-cart3"></i> Cart <span className="drawer-badge">5</span>
          </Link>

          {/* Mobile Categories */}
          <CategoriesDropdown mobile={true} categories={categories} closeDrawer={closeDrawer} />

          <Link to="/offers" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-tag"></i> Offers
          </Link>

          <Link to="/Addseller" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-shop"></i> Seller
          </Link>

          <Link to="/help" onClick={closeDrawer} className="premium-drawer-link">
            <i className="bi bi-question-circle"></i> Help
          </Link>
        </div>

        {isLoggedIn && (
          <div className="premium-drawer-footer">
            <button
              onClick={() => {
                closeDrawer();
                handleLogout();
              }}
              className="premium-drawer-logout"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        )}
      </div>

      {drawerOpen && <div className="premium-drawer-backdrop" onClick={closeDrawer}></div>}
    </>
  );
}
