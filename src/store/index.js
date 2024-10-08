import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";
import themeSlice from "./theme";
import salesSlice from "./sales";
import manageAppointmentsSlice from "./manageAppointments";
import loadsSlice from "./loads";
import carriersSlice from "./carriers";
import appointmentSlice from "./appointment";
const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    user: userSlice.reducer,
    sales: salesSlice.reducer,
    manageAppointments: manageAppointmentsSlice.reducer,
    loads: loadsSlice.reducer,
    carriers: carriersSlice.reducer,
    appointment: appointmentSlice.reducer,
  },
});
export default store;
