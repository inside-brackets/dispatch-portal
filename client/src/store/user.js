import { createSlice } from "@reduxjs/toolkit";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const initialState = {
  isAuthenticated: false,
  user: null,
  company: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.company = action.payload.company;
      const jwt = localStorage.getItem("user");
      if (jwt) {
        // set cookies expiration date
        const current = new Date();
        const nextYear = new Date();

        nextYear.setFullYear(current.getFullYear() + 1);
        cookies.set("user", jwt, { path: "/", expires: nextYear });
      }
    },
    logout(state, action) {
      state = initialState;
      action.payload.cb();
    },
    changeCompany(state, action) {
      state.company = action.payload;
    },
  },
});
export const userActions = userSlice.actions;
export default userSlice;
