import { BASE_URL } from "../../constants/urls";

export const getMasterReports = async (securityId: string) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/GetMasterReports?SecurityID=${securityId}`;
    const response = await fetch(url);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error: error, data: null };
  }
};

export const getReportDetails = async (
  securityId: string,
  reportId: string
) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/GetReportDetails?SecurityID=${securityId}&reportId=${reportId}`;
    const response = await fetch(url);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
};

export const getTableValues = async (accessCode: string, tableName: string) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/GetTableValues?SecurityID=${accessCode}&TableName=${tableName}`;
    const options = {
      method: "POST",
    };
    const response = await fetch(url, options);
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
};

export const getReportData = async (
  procedureParams: any,
  securityId: string,
  storedProcedure: string
) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/ExecuteStoredProcedureWith?securityID=${securityId}&procedureName=${storedProcedure}`;
    const options = {
      method: "POST",
      body:JSON.stringify({
        parameters: JSON.stringify(procedureParams),
      }),
      headers:{
        "Accept": "*/*",
        "Content-Type": "application/json"
      } 
    };
    const response = await fetch(url,options);
    const data = JSON.parse(await response.text());
    const reportData = JSON.parse(data).map((item: any, index: number) => ({
      ...item,
      id: index,
    }));
    return { error: null, data:reportData };
  } catch (error) {
    return { error, data: null };
  }
};
