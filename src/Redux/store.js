import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "./orderSlice";
import sellerReducer from "./sellerSlice";
import productReducer from "./productSlice";
import authReducer  from "./authSlice";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    seller: sellerReducer,
    product:productReducer,
    auth:authReducer
  },
});
export default store;
