 /**
   * Store to manage dangling appointments
   */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appointments: [],
};

const manageAppointmentsSlice = createSlice({
  name: "appoitments",
  initialState,
  reducers: {
    set(state, action) {
      state.appointments = action.payload;
    },
  },
});
export const manageAppointmentsActions = manageAppointmentsSlice.actions;
export default manageAppointmentsSlice;
