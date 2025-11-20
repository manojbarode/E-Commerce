import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Css/Navbar.css';
import CategoriesDropdown from "./CategoriesDropdown";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { login, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-md bg-white shadow custom-navbar px-3 py-2 rounded-bottom-4">
        <div className="container-fluid">
          <span className="navbar-brand fs-2 fw-bold text-primary">eShop</span>

          {/* MOBILE ICONS */}
          <div className="d-flex d-md-none gap-3 fs-4">
            <i className="bi bi-search"></i>
            <Link to="/cart" className="text-dark"><i className="bi bi-cart"></i></Link>
            <i className="bi bi-list fs-1" onClick={() => setOpen(true)}></i>
          </div>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav gap-4 mx-auto d-none d-md-flex">
              <li><Link to="/" className="nav-link custom-nav">Home</Link></li>
              <CategoriesDropdown/>
              <li><Link to="/offers" className="nav-link custom-nav">Offers</Link></li>
              <li><Link to="/seller" className="nav-link custom-nav">Seller</Link></li>
              <li><Link to="/help" className="nav-link custom-nav">Help</Link></li>
            </ul>

            <div className="search-box d-none d-md-flex ms-auto">
              <i className="bi bi-search me-2"></i>
              <input type="text" className="form-control border-0" placeholder="Search for products, brands..." />
            </div>

            {/* DESKTOP ICONS */}
            <div className="d-none d-md-flex gap-3 fs-4 ms-4 align-items-center">
              <Link to="/wishlist" className="text-primary"><i className="bi bi-heart-fill"></i></Link>
              <Link to="/cart" className="text-primary"><i className="bi bi-cart-fill"></i></Link>

              {login ? (
                <div className="d-flex align-items-center gap-3 fs-5">
                  <Link to="/profile" className="text-primary "><i className="bi bi-person-circle"></i></Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-primary me-2 fs-5">Login</Link>
                  <Link to="/signup" className="text-primary fs-5">Signup</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`custom-drawer ${open ? "show" : ""}`}>
        <div className="drawer-header">
          <span className="fw-bold fs-4">Menu</span>
          <i className="bi bi-x-lg fs-3" onClick={() => setOpen(false)}></i>
        </div>

        <div className="drawer-body">
          <div className="search-box w-100 mb-3">
            <i className="bi bi-search me-2"></i>
            <input className="form-control border-0" placeholder="Search..." />
          </div>

          <ul className="navbar-nav gap-3 mx-auto d-flex flex-column">
            <li><Link to="/" className="nav-link custom-nav">Home</Link></li>
            <CategoriesDropdown mobile={true}/>
            <li><Link to="/offers" className="nav-link custom-nav">Offers</Link></li>
            <li><Link to="/seller" className="nav-link custom-nav">Seller</Link></li>
            <li><Link to="/help" className="nav-link custom-nav">Help</Link></li>

            <li className="nav-item mt-3">
              {login ? (
                <div className="d-flex flex-column gap-2">
                  <Link to="/profile" className="text-primary">Profile</Link>
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Link to="/login" className="text-primary">Login</Link>
                  <Link to="/signup" className="text-primary">Signup</Link>
                </div>
              )}
            </li>
          </ul>

          <hr />
          <div className="d-flex justify-content-around fs-1 mt-3">
            <Link to="/wishlist"><i className="bi bi-heart-fill"></i></Link>
            <Link to="/cart"><i className="bi bi-cart-fill"></i></Link>
            <Link to={login ? "/profile" : "/login"}><i className="bi bi-person-circle"></i></Link>
          </div>
        </div>
      </div>
    </>
  );
}
