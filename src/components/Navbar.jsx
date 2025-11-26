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

  const handleProfileClick = () => {
    if (login) navigate("/profile");
    else navigate("/signup");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-lg sticky-top custom-navbar">
        <div className="container-fluid custom-container">
          <span className="navbar-brand fs-3 fw-bold text-primary"style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}>eShop</span>

          <button className="navbar-toggler" type="button" onClick={() => setDrawerOpen(true)}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 custom-nav-list">
              <li className="nav-item"><Link className="nav-link custom-nav" to="/">Home</Link></li>
              <li className="nav-item"><div className="custom-nav" style={{ cursor: "pointer" }}><CategoriesDropdown /></div></li>
              <li className="nav-item"><Link className="nav-link custom-nav" to="/offers">Offers</Link></li>
              <li className="nav-item"><Link className="nav-link custom-nav" to="/Addseller">Seller</Link></li>
              <li className="nav-item"><Link className="nav-link custom-nav" to="/help">Help</Link></li>
            </ul>
            <div className="search-box me-3 d-none d-lg-flex">
              <i className="bi bi-search me-2"></i>
              <input type="search" placeholder="Search products..." className="border-0 bg-transparent" style={{ outline: "none", width: "100%" }}/>
            </div>

            <div className="d-flex align-items-center gap-2 desktop-icons">
              <Link to="/wishlist" className="text-primary fs-4 text-decoration-none icon-link"><i className="bi bi-heart-fill"></i></Link>
              <Link to="/cart" className="text-primary fs-4 text-decoration-none icon-link"><i className="bi bi-cart-fill"></i></Link>

              {login ? (
                <>
                  <i className="bi bi-person-circle text-primary fs-3 icon-link" style={{ cursor: "pointer" }}onClick={handleProfileClick}></i>
                  <button className="btn btn-outline-danger btn-sm fw-bold" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <button className="btn btn-outline-primary btn-sm fw-bold" onClick={() => navigate("/signup")}>Sign Up</button>)}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`custom-drawer ${drawerOpen ? 'show' : ''}`}>
        <div className="drawer-header mb-4">
          <h4 className="text-primary fw-bold">eShop</h4>
          <button className="btn-close" onClick={closeDrawer}></button>
        </div>

        <div className="search-box mb-3 w-100">
          <i className="bi bi-search me-2"></i>
          <input type="search" placeholder="Search..." className="border-0 bg-transparent w-100"style={{ outline: "none" }}
          />
        </div>

        <div className="list-group list-group-flush">
          <Link to="/" className="list-group-item list-group-item-action drawer-link" onClick={closeDrawer}>Home</Link>
          <div className="list-group-item list-group-item-action drawer-link p-0 border-0">
            <CategoriesDropdown mobile={true} closeDrawer={closeDrawer} />
          </div>
          <Link to="/offers" className="list-group-item list-group-item-action drawer-link" onClick={closeDrawer}>Offers</Link>
          <Link to="/Addseller" className="list-group-item list-group-item-action drawer-link" onClick={closeDrawer}>Seller</Link>
          <Link to="/help" className="list-group-item list-group-item-action drawer-link" onClick={closeDrawer}>Help</Link>
        </div>
        <div className="search-box mb-3 w-100">
          <i className="bi bi-search me-2"></i>
          <input type="search" placeholder="Search..." className="border-0 bg-transparent w-100"style={{ outline: "none" }}/>
        </div>

        <div className="mt-4 d-flex gap-3 justify-content-center">
          <Link to="/wishlist" onClick={closeDrawer}><i className="bi bi-heart-fill text-primary fs-4"></i></Link>
          <Link to="/cart" onClick={closeDrawer}><i className="bi bi-cart-fill text-primary fs-4"></i></Link>

          {login ? (
            <>
              <i className="bi bi-person-circle text-primary fs-4" style={{ cursor: "pointer" }}
                onClick={() => {
                  closeDrawer();
                  handleProfileClick();
                }}
              ></i>
              <button className="btn btn-outline-danger btn-sm fw-bold" onClick={() => {
                  closeDrawer();
                  handleLogout();
                }}>
                Logout
              </button>
            </>
            ) : (
            <button className="btn btn-outline-primary btn-sm fw-bold" onClick={() => {
                closeDrawer();
                navigate("/signup");
              }}>Sign Up</button>)}
        </div>
      </div>
      {drawerOpen && <div className="drawer-backdrop" onClick={closeDrawer}></div>}
    </>
  );
}
