import { createSlice } from "@reduxjs/toolkit";

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
