import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterReport: null,
  selectedReportDetails: null,
  storedProcedureResult: null,
  report: null,
  storedProcedure:null
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
    setReport: (state, action) => {
      state.report = action.payload;
    },
    setStoredProcedure: (state, action) => {
      state.storedProcedure = action.payload;
    },
  },
});

export const {
  getMasterReports,
  setReportDetails,
  setStoredProcedureResult,
  setReport,
  setStoredProcedure
} = reportSlice.actions;

export default reportSlice.reducer;
