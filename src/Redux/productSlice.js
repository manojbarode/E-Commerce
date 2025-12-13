import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  productUid: localStorage.getItem("productUid") || null,
  products: JSON.parse(localStorage.getItem("products")) || [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductUid: (state, action) => {
      state.productUid = action.payload;
      localStorage.setItem("productUid", action.payload);
    },
    clearProductUid: (state) => {
      state.productUid = null;
      localStorage.removeItem("productUid");
    },
    setProducts: (state, action) => {
      state.products = action.payload;
      localStorage.setItem("products", JSON.stringify(action.payload));
    },
    addProduct: (state, action) => {
      state.products.push(action.payload);
      localStorage.setItem("products", JSON.stringify(state.products));
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.productUid === action.payload.productUid);
      if (index !== -1) {
        state.products[index] = action.payload;
        localStorage.setItem("products", JSON.stringify(state.products));
      }
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.productUid !== action.payload);
      localStorage.setItem("products", JSON.stringify(state.products));
    }
  }
});

export const { setProductUid, clearProductUid, setProducts, addProduct, updateProduct, removeProduct } = productSlice.actions;
export default productSlice.reducer;
