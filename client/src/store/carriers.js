import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const carriersSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
    set(state, action) {
      state = action.payload;
    },
    append(state, action) {
      state.push(action.payload);
    },
  },
});
export const carriersActions = carriersSlice.actions;
export default carriersSlice;
