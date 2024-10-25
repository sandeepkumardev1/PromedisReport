import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    masterReport:null
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getMasterReports: (state, action) => {
        state.masterReport = action.payload
    },
  },
});

export const { getMasterReports } = reportSlice.actions;

export default reportSlice.reducer;
