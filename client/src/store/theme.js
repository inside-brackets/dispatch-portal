import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "Theme",
  initialState: {},
  reducers: {
    setMode(state, action) {
      state.mode = action.payload;
    },
    setColor(state, action) {
      state.color = action.payload;
    },
  },
});

export const themeActions = themeSlice.actions;
export default themeSlice;
