import { createSlice } from "@reduxjs/toolkit";

const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: !!token,
  token: token || null,
  user: user || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;

      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;

      sessionStorage.clear();
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
