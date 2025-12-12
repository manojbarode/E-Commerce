import React, { createContext, useState } from "react";

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [price, setPaymentPrice] = useState(0);
  const [productUid, setproductUid] = useState("");

  return (
    <PaymentContext.Provider
      value={{
        price,
        setPaymentPrice,
        productUid,
        setproductUid,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
