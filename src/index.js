import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentProvider"; // import PaymentProvider
import { SellerProvider } from "./context/SellerProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <PaymentProvider>
        <SellerProvider>
            <App />
        </SellerProvider>
      </PaymentProvider>
    </AuthProvider>
  </BrowserRouter>
);
