import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Addseller from "./pages/Seller/Addseller";
import HelpDesk from "./pages/help";
import ProductUpload from "./pages/Seller/ProductUpload";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import SellerDashboard from "./pages/Seller/SellerDashboard1/SellerDashboard";



const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Addseller" element={<Addseller />} />
        <Route path="/help" element={<HelpDesk />}/>
        <Route path="/dashboard" element={<AdminDashboard/>}/>
        <Route path="/sellerdashboard" element={<SellerDashboard/>}/>
        <Route path="/sellerpage/product-upload" element={<ProductUpload />} />
        <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
