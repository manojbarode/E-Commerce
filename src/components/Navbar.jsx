  import { useContext, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  import "bootstrap-icons/font/bootstrap-icons.css";
  import { AuthContext } from "../context/AuthContext";
  import CategoriesDropdown from "./CategoriesDropdown";
  import "./Css/Navbar.css";

  export default function Navbar() {
    const { login, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchVisible, setSearchVisible] = useState(false);

    const handleProfileClick = () => {
      login ? navigate("/profile") : navigate("/signup");
    };

    const handleLogout = () => {
      logoutUser();
      navigate("/");
    };

    const closeDrawer = () => setDrawerOpen(false);

    return (
      <>
        {/* ===== PREMIUM NAVBAR - DARK MODE ===== */}
        <nav className="premium-navbar navbar navbar-expand-lg sticky-top">
          <div className="container-fluid px-4">
            {/* Logo */}
            <span
              className="premium-logo"
              onClick={() => navigate("/")}
            >
              eShop
            </span>

            {/* Desktop Navigation Links */}
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <Link className="premium-nav-link nav-link-home" to="/">
                    <i className="bi bi-house-door me-2"></i>Home
                  </Link>
                </li>

                <li className="nav-item">
                  <CategoriesDropdown onCategorySelect={(cat) => setSelectedCategory(cat)} />
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
                <input
                  type="search"
                  placeholder="Search products..."
                  className="premium-search-input"
                />
              </div>

              {/* Desktop Icons */}
              <div className="premium-nav-icons d-none d-lg-flex">
                <Link to="/wishlist" className="premium-icon-btn icon-wishlist" title="Wishlist">
                  <i className="bi bi-heart"></i>
                  <span className="icon-badge">3</span>
                </Link>
                
                <Link to="/cart" className="premium-icon-btn icon-cart" title="Cart">
                  <i className="bi bi-cart3"></i>
                  <span className="icon-badge">5</span>
                </Link>

                {login ? (
                  <>
                    <div className="premium-icon-btn icon-profile" onClick={handleProfileClick} title="Profile">
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

            {/* Mobile Right Section - Search + Icons + Toggle */}
            <div className="d-flex d-lg-none align-items-center gap-2">
              {/* Mobile Search Toggle */}
              <button 
                className="premium-mobile-icon icon-search-mobile"
                onClick={() => setSearchVisible(!searchVisible)}
              >
                <i className="bi bi-search"></i>
              </button>

              {/* Mobile Profile/Login - RETAINED */}
              {login ? (
                <div className="premium-mobile-icon icon-profile-mobile" onClick={handleProfileClick}>
                  <i className="bi bi-person-circle"></i>
                </div>
              ) : (
                <button className="premium-mobile-login btn-login-mobile" onClick={() => navigate("/signup")}>
                  <i className="bi bi-box-arrow-in-right"></i>
                </button>
              )}

              {/* Mobile Menu Toggle - RETAINED */}
              <button
                className="premium-mobile-toggle toggle-menu"
                onClick={() => setDrawerOpen(true)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Expandable) */}
          {searchVisible && (
            <div className="premium-mobile-search d-lg-none">
              <div className="container-fluid px-4">
                <div className="premium-search-box-mobile">
                  <i className="bi bi-search"></i>
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="premium-search-input"
                    autoFocus
                  />
                  <button 
                    className="search-close"
                    onClick={() => setSearchVisible(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* ===== PREMIUM MOBILE DRAWER (UPDATED) ===== */}
        <div className={`premium-drawer ${drawerOpen ? "show" : ""}`}>
          <div className="premium-drawer-header">
            <h4 className="premium-drawer-title">Menu</h4>
            <button className="premium-drawer-close" onClick={closeDrawer}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <div className="premium-drawer-content">
            <Link to="/" className="premium-drawer-link drawer-home" onClick={closeDrawer}>
              <i className="bi bi-house-door"></i>
              <span>Home</span>
            </Link>

            <Link to="/wishlist" className="premium-drawer-link drawer-wishlist" onClick={closeDrawer}>
              <i className="bi bi-heart"></i>
              <span>Wishlist <span className="drawer-badge">3</span></span>
            </Link>

            <Link to="/cart" className="premium-drawer-link drawer-cart" onClick={closeDrawer}>
              <i className="bi bi-cart3"></i>
              <span>Cart <span className="drawer-badge">5</span></span>
            </Link>
            
            <div className="premium-drawer-categories">
              <CategoriesDropdown
                mobile={true}
                closeDrawer={closeDrawer}
                onCategorySelect={(cat) => setSelectedCategory(cat)}
              />
            </div>

            <Link to="/offers" className="premium-drawer-link drawer-offers" onClick={closeDrawer}>
              <i className="bi bi-tag"></i>
              <span>Offers</span>
            </Link>
            
            <Link to="/Addseller" className="premium-drawer-link drawer-seller" onClick={closeDrawer}>
              <i className="bi bi-shop"></i>
              <span>Seller</span>
            </Link>
            
            <Link to="/help" className="premium-drawer-link drawer-help" onClick={closeDrawer}>
              <i className="bi bi-question-circle"></i>
              <span>Help</span>
            </Link>
          </div>

          {/* Drawer Footer with Logout */}
          {login && (
            <div className="premium-drawer-footer">
              <button 
                className="premium-drawer-logout btn-drawer-logout"
                onClick={() => { closeDrawer(); handleLogout(); }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {drawerOpen && <div className="premium-drawer-backdrop" onClick={closeDrawer}></div>}
      </>
    );
  }