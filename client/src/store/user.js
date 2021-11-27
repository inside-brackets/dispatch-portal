import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  isAuthorized: true,
  company:null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAuthorized = true;
      state.company = { label: "Elite Dispatch Service", value: "elite"}
    },
    logout(state, action) {
      state = initialState;
      action.payload.cb();
    },
    unauthorize(state) {
      state.isAuthorized = false;
    },
    changeCompany(state,action){
      state.company = action.payload
    }
  },
});
export const userActions = userSlice.actions;
export default userSlice;
