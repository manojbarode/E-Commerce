import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerUid: localStorage.getItem("sellerUid") || "",
  sellerName: localStorage.getItem("sellerName") || "",
  token: localStorage.getItem("sellerToken") || "",
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    setSeller: (state, action) => {
      state.sellerUid = action.payload.sellerUid;
      state.sellerName = action.payload.sellerName;
      state.token = action.payload.token;
      localStorage.setItem("sellerUid", action.payload.sellerUid);
      localStorage.setItem("sellerName", action.payload.sellerName);
      localStorage.setItem("sellerToken", action.payload.token);
    },
    logoutSeller: (state) => {
      state.sellerUid = "";
      state.sellerName = "";
      state.token = "";
      localStorage.removeItem("sellerUid");
      localStorage.removeItem("sellerName");
      localStorage.removeItem("sellerToken");
    },
  },
});

export const { setSeller, logoutSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
