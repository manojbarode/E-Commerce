import { createSlice } from "@reduxjs/toolkit";

// src/Redux/authSlice.js
const token = localStorage.getItem("token") || null;
const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: !!token,
  token: token,
  user: user,
  userUid: user?.userUid || null,  // add this
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
      state.userUid = user.userUid;  // set userUid
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.userUid = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
