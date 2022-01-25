import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loads: [],
};

const loadsSlice = createSlice({
  name: "loads",
  initialState,
  reducers: {
    set(state, action) {
      state.loads = action.payload;
    },
    append(state, action) {
      state.loads.unshift(action.payload);
    },
    replace(state, action) {
      // var newLoads = [];
      const newLoad = action.payload;
      state.loads = state.loads.map((item) => {
        return item._id === newLoad._id ? newLoad : item;
      });
    },
  },
});
export const loadsActions = loadsSlice.actions;
export default loadsSlice;
