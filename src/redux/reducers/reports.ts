import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterReport: null,
  selectedReportDetails: null,
  storedProcedureResult: null,  
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getMasterReports: (state, action) => {
      state.masterReport = action.payload;
    },
    setReportDetails: (state, action) => {
      state.selectedReportDetails = action.payload;
    },
    setStoredProcedureResult: (state, action) => {
      state.storedProcedureResult = action.payload;  
    },
  },
});

// Export actions
export const { getMasterReports, setReportDetails, setStoredProcedureResult } = reportSlice.actions;

export default reportSlice.reducer;
