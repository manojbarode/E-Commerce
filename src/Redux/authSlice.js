import { createSlice } from "@reduxjs/toolkit";

// Get token & user from sessionStorage
const token = sessionStorage.getItem("token");
const user = sessionStorage.getItem("user")
  ? JSON.parse(sessionStorage.getItem("user"))
  : null;

const initialState = {
  isLoggedIn: !!token,
  token: token || null,
  user: user || null,
  userUid: user?.userUid || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { token, user } = action.payload;

      state.isLoggedIn = true;
      state.token = token;
      state.user = user;
      state.userUid = user.userUid;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    },

    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      state.userUid = null;

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
