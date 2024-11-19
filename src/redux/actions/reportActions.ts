import * as api from "../api/reportsAPI";
import { getMasterReports, setReportData } from "../reducers/reports";
import { setReportDetails } from "../reducers/reports";

export const getMasterReportsAction: any =
  (securityId: string) => async (dispatch: any) => {
    try {
      const { data, error } = await api.getMasterReports(securityId);
      if (error) {
        console.error("Error:", error);
      } else {
        dispatch(getMasterReports(data));
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

export const getReportDetailsAction: any =
  (securityId: string, reportId: string) => async (dispatch: any) => {
    try {
      const { data, error } = await api.getReportDetails(securityId, reportId);
      if (error) {
        console.error("Failed to fetch report details:", error);
      } else {
        dispatch(setReportDetails(data));
      }
    } catch (error: any) {
      console.error("Unexpected error fetching report details:", error);
    }
  };

export const getTableValuesAction: any =
  async (accessCode: string, tableName: string) => {
    try {
      const { data, error } = await api.getTableValues(accessCode, tableName);
      if (error) {
        console.error("Failed to fetch table values:", error);
      } else {
        return { data };
      }
    } catch (error: any) {
      console.error("Unexpected error fetching table values:", error);
    }
  };

export const getReportDataAction: any =
  (procedureParams: any, securityId: string, storedProcedure: string,groupingColumnName:string) =>
  async (dispatch: any) => {
    try {
      const { data, error } = await api.getReportData(
        procedureParams,
        securityId,
        storedProcedure,
        groupingColumnName
      );
      if (error) {
        console.error("Error:", error);
        dispatch(setReportData(null));
      } else {
        dispatch(setReportData(data));
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };
