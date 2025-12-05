import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HelpDesk from "./pages/Extra/help";
import ProductUpload from "./pages/Seller/ProductUpload";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SellerDashboard from "./pages/Seller/SellerDashboard1/SellerDashboard";
import OffersPage from "./pages/Extra/Offers";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUP/Signup";
import Profile from "./pages/Profile/Profile";
import ProductDetails from "./pages/Product/ProductDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BuyNow from "./pages/Profile/buynow";
import SellerLogout from "./pages/Seller/SellerDashboard1/SellerLogout";
import PaymentForm from "./Payment/payment";
import SellerAuth from "./pages/Seller/SellerAuth/Seller";
import SellerForm from "./pages/Seller/SellerDetails/SellerDetailsForm";
// import SellerForm from "./pages/Seller/SellerDetails/SellerDetailsForm";

const App = () => {
  return (
    <>
      <ToastContainer position="top-center" />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Addseller" element={<SellerAuth />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpDesk />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/sellerdashboard" element={<SellerDashboard />} />
          <Route path="/sellerpage/product-upload" element={<ProductUpload />} />
          <Route path="/Profile/buynow" element={<BuyNow/>}/>
          <Route path="/sellerlogout" element={<SellerLogout />} />
          <Route path="/SellerDetailsForm" element={<SellerForm />} />
          <Route path="/payment" element={<PaymentForm/>}/>
    

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
