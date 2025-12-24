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
import ProductUpload from "./components/ProductUpload/ProductUpload";
import SellerForm from "./pages/Seller/SellerDetails/SellerDetailsForm";
import SellerProducts from "./pages/Seller/ProductManagment/Sellerproduct";
import SellerOrdersPage from "./pages/Seller/ProductManagment/SellerOrdersPage";
import UpdateProduct from "./pages/Seller/ProductManagment/SellerProductUpdate";
import ProductDetails from "./pages/Product/ProductDetails";
import UserOrderedProducts from "./pages/Profile/UserOrderedProducts";
import Checkout from "./pages/Profile/Checkout";
import PaymentForm from "./Payment/payment";
import Order from "./pages/Seller/SellerAuth/Order/order"; 
import PaymentSuccess from "./Payment/PaymentSuccess";
import RefundPayment from "./pages/Seller/SellerAuth/Order/refund_payment";
import Delivery from "./pages/Seller/SellerAuth/Order/delivery";
import Return from "./pages/Seller/SellerAuth/Order/return";
import Offer from "./pages/Seller/SellerAuth/Order/offer_rewards";
import Offer_Rewards from "./pages/Seller/SellerAuth/Order/offer_rewards";
import Account from "./pages/Seller/SellerAuth/Order/account";
import ChangePassword from "./pages/Seller/SellerAuth/Order/change_password";
import LoginIssue from "./pages/Seller/SellerAuth/Order/login_issue";
import DeactivateAccount from "./pages/Seller/SellerAuth/Order/deactivate";
import Chat from "./pages/Seller/SellerAuth/Order/chat";


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
          <Route path="/profile/wishcart" element={<PrivateRoute><WishCart /></PrivateRoute>}/>
          <Route path="/productDetails" element={<ProductDetails />}/>
          <Route path="/profile/userOrders" element={<UserOrderedProducts />}/>
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>}/>
          <Route path="/payment" element={<PaymentForm />}/>
          <Route path="/payment-success" element={<PaymentSuccess />}/>
          <Route path="/order" element={<Order/>}/>
          <Route path="/refund-payment" element={<RefundPayment/>}/>
          <Route path="/delivery" element={<Delivery/>} />
          <Route path="/return" element={<Return/>} />
          <Route path="/offer-rewards" element={<Offer_Rewards/>} />
          <Route path="/account" element={<Account/>}/>
          <Route path="/change-password" element={<ChangePassword/>}/>
          <Route path="/login-issue" element={<LoginIssue/>}/>
          <Route path="/deactivate" element={<DeactivateAccount/>} />
          <Route path="/chat" element={<Chat/>}/>
           {/* Product */}
          <Route path="/products/:productUid" element={<ProductDetails />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin/dashboard" element={<AdminRoutes><AdminDashboard/></AdminRoutes>}/>
          <Route path="/admin/payment/form" element={<AdminRoutes><PaymentMethodAddForm/></AdminRoutes>}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
