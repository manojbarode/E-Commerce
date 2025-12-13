import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sellerUid: "",
  productUid: "",
  buyerUid: "",
  quantity: 1,
  amount: 0,
  totalAmount: 0,
  paymentMethod: "",
  paymentStatus: "PENDING",
  currency: "INR",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSellerUid: (state, action) => {
      state.sellerUid = action.payload;
    },
    setProductUid: (state, action) => {
      state.productUid = action.payload;
    },
    setBuyerUid: (state, action) => {
      state.buyerUid = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
      state.totalAmount = state.amount * action.payload;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
      state.totalAmount = state.amount * state.quantity;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    resetOrder: () => initialState,
  },
});

export const {
  setSellerUid,
  setProductUid,
  setBuyerUid,
  setQuantity,
  setAmount,
  setPaymentMethod,
  setPaymentStatus,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
