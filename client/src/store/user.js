import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state, action) {
      state = initialState;
      action.payload.cb();
    },
  },
});
export const userActions = userSlice.actions;
export default userSlice;
