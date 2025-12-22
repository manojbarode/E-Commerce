import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUP/Signup";
import HelpDesk from "./pages/Extra/help";
import OffersPage from "./pages/Extra/Offers";

import SellerDashboard from "./pages/Seller/SellerDashboard1/SellerDashboard";

import PrivateRoute from "./context/PrivateRoute";
import SellerProtectedRoute from "./context/SellerProtectedRoute";

import Cart from "./pages/Profile/Cart";
import WishCart from "./pages/Profile/WishCart";
import Profile from "./pages/Profile/Profile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SellerAuth from "./pages/Seller/SellerAuth/Seller";
import { ProductAdd } from "./api/productApi";
import ProductUpload from "./components/ProductUpload/ProductUpload";
import SellerForm from "./pages/Seller/SellerDetails/SellerDetailsForm";
import SellerProducts from "./pages/Seller/ProductManagment/Sellerproduct";
import SellerOrdersPage from "./pages/Seller/ProductManagment/SellerOrdersPage";
import UpdateProduct from "./pages/Seller/ProductManagment/SellerProductUpdate";
import AddressBook from "./pages/Profile/buynow";
import ProductDetails from "./pages/Product/ProductDetails";
import UserOrderedProducts from "./pages/Profile/UserOrderedProducts";
import Checkout from "./pages/Profile/Checkout";
import PaymentForm from "./Payment/payment";

const App = () => {
  return (
    <>
      <ToastContainer position="top-center" />

      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/help" element={<HelpDesk />} />

          <Route path="/seller" element={<SellerAuth />} />
          <Route path="/seller/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>}/>
          <Route path="/sellerpage/product-upload" element={<SellerProtectedRoute><ProductUpload /></SellerProtectedRoute>}/>
          <Route path="/SellerDetailsForm" element={<SellerProtectedRoute><SellerForm /></SellerProtectedRoute>}/>
          <Route path="/seller/sellerproduct" element={<SellerProtectedRoute><SellerProducts /></SellerProtectedRoute>}/>
          <Route path="/seller/sellerOrderPage" element={<SellerProtectedRoute><SellerOrdersPage /></SellerProtectedRoute>}/>
          <Route path="/seller/update-product" element={<SellerProtectedRoute><UpdateProduct /></SellerProtectedRoute>}/>

          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/cart" element={<PrivateRoute><Cart /></PrivateRoute>}/>
          <Route path="/profile/wishcart" element={<PrivateRoute> <WishCart /></PrivateRoute>}/>
          <Route path="/buynow" element={<PrivateRoute> <AddressBook /></PrivateRoute>}/>
          <Route path="/productDetails" element={<ProductDetails />}/>
          <Route path="/profile/userOrders" element={<UserOrderedProducts />}/>
          <Route path="/checkout" element={<Checkout />}/>
          <Route path="/payment" element={<PaymentForm />}/>
          <Route path="/payment-success" element={<PaymentForm />}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
