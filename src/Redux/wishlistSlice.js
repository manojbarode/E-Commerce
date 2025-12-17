import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistCount: (state, action) => {
      state.count = action.payload;
    },
    incrementWishlist: (state) => {
      state.count += 1;
    },
    decrementWishlist: (state) => {
      if (state.count > 0) state.count -= 1;
    },
    resetWishlist: (state) => {
      state.count = 0;
    }
  }
});

export const {
  setWishlistCount,
  incrementWishlist,
  decrementWishlist,
  resetWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
