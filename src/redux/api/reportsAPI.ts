export const getMasterReports = async (securityId:string) => {
    try {
        const url = `/api/ReportsManagement.svc/rest/GetMasterReports?SecurityID=${securityId}`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        return { error: null, data};
      } catch (error: any) {
        return { error: error, data: null };
      }
}

// reportsAPI.ts
export const getReportDetails = async (securityId: string, reportId: string) => {
  try {
    const url = `/api/ReportsManagement.svc/rest/GetReportDetails?SecurityID=${securityId}&reportId=${reportId}`;
    const options = {
      method: "GET",  // Use GET instead of POST
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
};
export const getTableValues = async (accessCode: string, tableName: string, WhereCondition: string) => {
  try {
    const url = `/api/ReportsManagement.svc/rest/GetTableValues?SecurityID=${accessCode}&TableName=${tableName}`;
    const options = {
      method: "POST",  // Use POST method for fetching data
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);    
    const responseText = await response.text();    

    try {
      const data = JSON.parse(responseText);
      return { error: null, data };
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      return { error: "Failed to parse JSON", data: null };
    }
  } catch (error: any) {
    return { error, data: null };
  }
};

export const ExecuteStoredProcedure = async (securityId: string,procedureName: string,requestBody: any) => {
  try {
    const url =  `/api/ReportsManagement.svc/rest/ExecuteStoredProcedureWith?securityID=${securityId}&procedureName=${procedureName}`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), 
    };
    const response = await fetch(url, options);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
};


