import * as api from "../api/reportsAPI";
import {
  ExecuteStoredProcedure,
  getReportDetails,
  getTableValues,
} from "../api/reportsAPI";
import {
  getMasterReports,
  setStoredProcedureResult,
} from "../reducers/reports";
import { setReportDetails } from "../reducers/reports";

export const getMasterReportsAction: any =
  (securityId: string) => async (dispatch: any) => {
    try {
      const { data, error } = await api.getMasterReports(securityId);
      if (error) {
      } else {
        dispatch(getMasterReports(data));
      }
    } catch (error: any) {}
  };

export const getReportDetailsAction: any =
  (securityId: string, reportId: string) => async (dispatch: any) => {
    try {
      const { data, error } = await getReportDetails(securityId, reportId);
      if (error) {
        console.error("Failed to fetch report details:", error);
      } else {
        dispatch(setReportDetails(data));
        return { data };
      }
    } catch (error: any) {
      console.error("Unexpected error fetching report details:", error);
    }
  };

export const getTableValuesAction: any =
  (accessCode: string, tableName: string) => async (dispatch: any) => {
    try {
      const { data, error } = await getTableValues(accessCode, tableName, "");
      if (error) {
        console.error("Failed to fetch table values:", error);
      } else {
        return { data };
      }
    } catch (error: any) {
      console.error("Unexpected error fetching table values:", error);
    }
  };

export const ExecuteStoredProcedureAction: any =
  (securityId: string, procedureName: string, requestBody: any) =>
  async (dispatch: any) => {
    try {
      const { data, error } = await ExecuteStoredProcedure(
        securityId,
        procedureName,
        requestBody
      );
      if (error) {
        console.error("Failed to fetch report details:", error);
      } else {
        const parsedData = JSON.parse(data);
        const dataWithId = parsedData.map((row: any, index: number) => ({
          id: index,
          ...row,
        }));
        dispatch(setStoredProcedureResult(dataWithId));
        return { data: dataWithId };
      }
    } catch (error: any) {
      console.error("Unexpected error fetching report details:", error);
    }
  };
