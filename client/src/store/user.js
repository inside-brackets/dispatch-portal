import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  isAuthorized: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAuthorized = true;
    },
    logout(state, action) {
      state = initialState;
      action.payload.cb();
    },
    unauthorize(state) {
      state.isAuthorized = false;
    },
  },
});
export const userActions = userSlice.actions;
export default userSlice;
