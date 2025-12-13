// src/Redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
const token = sessionStorage.getItem("token") || null;
const user = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: !!token,
  token: token,
  user: user,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { token, user } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      state.user = user;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
