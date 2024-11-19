import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterReport: null,
  reportDetails: null,
  report: null,
  storedProcedure: null,
  reportData: null,
  showLoader:false
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    getMasterReports: (state, action) => {
      state.masterReport = action.payload;
    },
    setReportDetails: (state, action) => {
      state.reportDetails = action.payload;
    },
    setReport: (state, action) => {
      state.report = action.payload;
    },
    setStoredProcedure: (state, action) => {
      state.storedProcedure = action.payload;
    },
    setReportData: (state, action) => {
      state.reportData = action.payload;
    },
    showLoader:(state) => {
      state.showLoader = true
    },
    hideLoader:(state) => {
      state.showLoader = false
    },
    clearReportsData:(state) => {
      state.reportData = null;
      state.reportDetails = null;
      state.masterReport = null;
    }
  },
});

export const {
  getMasterReports,
  setReportDetails,
  setReport,
  setStoredProcedure,
  setReportData,
  clearReportsData,
  showLoader,
  hideLoader
} = reportSlice.actions;

export default reportSlice.reducer;
