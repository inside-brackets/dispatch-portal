import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carriers: [],
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setAndPrepare(state, action) {
      const data = action.payload;
      const newCarrier = [];
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].trucks.length; j++) {
          if (data[i].trucks[j].t_status === "new") {
            newCarrier.push({
              mc_number: data[i].mc_number,
              trailer_type: data[i].trucks[j].trailer_type,
              truck_number: data[i].trucks[j].truck_number,
              company_name: data[i].company_name,
              salesman: data[i].salesman ? data[i].salesman.user_name : "N/A",
            });
          }
        }
      }
      state.carriers = newCarrier;
    },
    set(state, action) {
      state.carriers = action.payload;
    },
  },
});
export const salesActions = salesSlice.actions;
export default salesSlice;
