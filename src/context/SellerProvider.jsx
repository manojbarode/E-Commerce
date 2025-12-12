import { createContext, useState } from "react";

export const SellerContext = createContext();

export const SellerProvider = ({ children }) => {
  const [sellerUid, setSellerUid] = useState("");
  const [productUid, setProductUid] = useState("");
  return (
    <SellerContext.Provider
      value={{
        sellerUid,
        setSellerUid,
        productUid,
        setProductUid,
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};
