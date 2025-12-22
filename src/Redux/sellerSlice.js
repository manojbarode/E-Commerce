import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("sellerToken") || "",
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("sellerToken", action.payload.token);
    },
    logoutSeller: (state) => {
      state.token = "";
      localStorage.removeItem("sellerToken");
    },
  },
});

export const { setSeller, logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
