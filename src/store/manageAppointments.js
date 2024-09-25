/**
 * Store to manage dangling appointments
 */
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   appointments: [],
// };

// const manageAppointmentsSlice = createSlice({
//   name: "appoitments",
//   initialState,
//   reducers: {
//     set(state, action) {
//       state.appointments = action.payload;
//     },
//   },
// });
// export default manageAppointmentsSlice;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getDanglingAppointments = createAsyncThunk("appoitments/getDanglingAppointments", async (selectedCompany) => {
  try {
    const response = await axios.post("/getcarriers", {
      c_status: "dangling_appointment",
      company: selectedCompany,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
});

const manageAppointmentsSlice = createSlice({
  name: "appoitments",
  initialState: {
    appointments: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {
    set(state, action) {
      state.appointments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDanglingAppointments.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getDanglingAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.isLoading = false;
        state.hasError = false;
      })
      .addCase(getDanglingAppointments.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
      });
  },
});

// Selectors
export const selectAppointments = (state) => state.appointments.appointments;
export const selectLoadingState = (state) => state.appointments.isLoading;
export const selectErrorState = (state) => state.appointments.hasError;

export const manageAppointmentsActions = manageAppointmentsSlice.actions;
export default manageAppointmentsSlice;
