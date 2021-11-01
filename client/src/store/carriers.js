import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const carriersSlice = createSlice({
  name: "carriers",
  initialState,
  reducers: {
    set(state, action) {
      state.list = action.payload;
    },
    append(state, action) {
      state.list.push(action.payload);
    },
  },
});
export const carriersActions = carriersSlice.actions;
export default carriersSlice;
