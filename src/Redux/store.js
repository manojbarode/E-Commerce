import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "./orderSlice";
import sellerReducer from "./sellerSlice";
import productReducer from "./productSlice";
import authReducer  from "./authSlice";
import cartReducer from "./cartSlice.js";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    seller: sellerReducer,
    product:productReducer,
    auth:authReducer,
    cart:cartReducer,
  },
});
export default store;
