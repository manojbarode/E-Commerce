import { configureStore } from "@reduxjs/toolkit";

import orderReducer from "./orderSlice";
import sellerReducer from "./sellerSlice";
import productReducer from "./productSlice";
import authReducer  from "./authSlice";
import cartReducer from "./cartSlice.js";
import wishlistReducer from "./wishlistSlice.js";
import categoriesReducer from "./categoriesSlice.js";

export const store = configureStore({
  reducer: {
    order: orderReducer,
    seller: sellerReducer,
    product:productReducer,
    auth:authReducer,
    cart:cartReducer,
    wishlist: wishlistReducer,
    categories: categoriesReducer, 
  },
});
export default store;
