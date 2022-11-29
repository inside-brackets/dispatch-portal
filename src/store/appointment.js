import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    change(state, action) {
      state.value = action.payload;
    },
  },
});
export const {change} = appointmentSlice.actions;
export default appointmentSlice;
