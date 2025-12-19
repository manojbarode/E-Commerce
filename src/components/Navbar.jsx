import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../Redux/authSlice";
import CategoriesDropdown from "./CategoriesDropdown";
import { fetchCategories1 } from "../Redux/categoriesSlice";
import "./Css/Navbar.css";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = useSelector((state) => state.wishlist?.count || 0);

  const categories = useSelector((state) => state.categories.data || []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    dispatch(fetchCategories1());
  }, [dispatch]);

  const handleProfileClick = () => {
    isLoggedIn ? navigate("/profile") : navigate("/signup");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const closeDrawer = () => setDrawerOpen(false);

  const cartClick = () => {
    if (!isLoggedIn) {
      toast.warning("Please login first");
    } else {
      navigate("/profile/cart");
    }
  };

  return (
    <>
      {/* MAIN NAV */}
      <nav className="premium-navbar navbar navbar-expand-lg sticky-top">
        <div className="container-fluid px-4">
          <span className="premium-logo" onClick={() => navigate("/")}>eShop</span>

          {/* Mobile Search */}
          <div className="premium-search-box premium-mobile-search-inline-permanent d-lg-none">
            <i className="bi bi-search"></i>
            <input type="search" placeholder="Search products..." className="premium-search-input" />
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
              <Link to="/profile/wishcart" className="premium-icon-btn icon-wishlist">
                <i className="bi bi-heart"></i>
                {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
              </Link>

              <Link to="/profile/cart" className="premium-icon-btn icon-cart">
                <i className="bi bi-cart3" onClick={cartClick}></i>
                <span className="icon-badge">{cartCount}</span>
              </Link>

              {isLoggedIn ? (
                <>
                  <div className="premium-icon-btn icon-profile" onClick={handleProfileClick}>
                    <i className="bi bi-person-circle"></i>
                  </div>
                  <button className="premium-logout-btn btn-logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className="premium-signup-btn btn-signup" onClick={() => navigate("/signup")}>Sign Up</button>
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

          <Link to="/profile/wishcart" className="premium-icon-btn icon-wishlist">
            <i className="bi bi-heart"></i>{wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
          </Link>

          <Link to="/profile/cart" className="premium-icon-btn icon-cart">
            <i className="bi bi-cart3" onClick={cartClick}></i>
            <span className="icon-badge">{cartCount}</span>
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
            <button onClick={() => { closeDrawer(); handleLogout(); }} className="premium-drawer-logout">
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        )}
      </div>

      {drawerOpen && <div className="premium-drawer-backdrop" onClick={closeDrawer}></div>}
    </>
  );
}
