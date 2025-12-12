import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentProvider"; // import PaymentProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <PaymentProvider>
        <App />
      </PaymentProvider>
    </AuthProvider>
  </BrowserRouter>
);
