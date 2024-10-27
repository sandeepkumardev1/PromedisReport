import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterReport: null,
  selectedReportDetails: null,
  storedProcedureResult: null,  
  storedProcedureName: null,  
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
    setStoredProcedureName: (state, action) => {
      state.storedProcedureName = action.payload;  
    },
  },
});

// Export actions
export const { getMasterReports, setReportDetails, setStoredProcedureResult,setStoredProcedureName } = reportSlice.actions;

export default reportSlice.reducer;
