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
      state.user = action.payload.user;
      state.isAuthorized = true;
      state.company = action.payload.company
    },
    logout(state, action) {
      state =  initialState;
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
