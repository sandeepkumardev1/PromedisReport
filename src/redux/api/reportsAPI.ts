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
  storedProcedure: string,
  GroupingColumnName: string
) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/ExecuteStoredProcedureWith?securityID=${securityId}&procedureName=${storedProcedure}`;
    const options = {
      method: "POST",
      body: JSON.stringify({
        parameters: JSON.stringify(procedureParams),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);

    const data = JSON.parse(await response.text());
    let reportData = JSON.parse(data).map((item: any, index: number) => {
      const formattedItem = { ...item, id: index };     
      
      Object.keys(formattedItem).forEach((key) => {
        if (typeof formattedItem[key] === "number") {
          formattedItem[key] = parseFloat(`${formattedItem[key]}`).toFixed(2);
        }
      });
      
      return formattedItem;
    });

    let index = JSON.parse(data).length
    
    if (GroupingColumnName) {
      const groupedData = reportData.reduce((acc: any, item: any) => {
        const group = item[GroupingColumnName] || "Ungrouped";
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {});

      reportData = [];
      for (const group in groupedData) {
        const groupItems = groupedData[group];
        const totalRow: any = { [GroupingColumnName]: `${group} Total`,id:99999 };

        Object.keys(groupItems[0]).forEach((key) => {
          if (!isNaN(groupItems[0][key]) && /Amt|Amount|Discount|Balance/i.test(key)) {
            var total = groupItems.reduce((sum: number, item: any) => sum + parseFloat(item[key]), 0)
            totalRow[key] = parseFloat(`${total}`).toFixed(2);
          }else{
            totalRow[key] = ""
          }
        });
        totalRow[GroupingColumnName] = `${groupItems[0][GroupingColumnName]} Total`
        totalRow['id'] = index
        reportData = [...reportData, ...groupItems,totalRow];
        index += 1
      }
    }

    let grandTotal:any = new Object()
    const result = JSON.parse(data);
    let isAmountFieldExist = false

    Object.keys(result[0]).map((key:any) => {
      if (!isNaN(result[0][key]) && /Amt|Amount|Discount|Balance/i.test(key)) {
        var total = result.reduce((sum: number, item: any) => sum + (item[key] ? parseFloat(item[key]):0), 0)
        grandTotal[key] = parseFloat(`${total}`).toFixed(2);
        isAmountFieldExist = true
      }else{
        grandTotal[key] = ""
      }
    })
    grandTotal[Object.keys(result[0])[0]] = 'Grand Total'
    grandTotal['id'] = index + 1
    reportData = isAmountFieldExist ?  [...reportData,grandTotal] : reportData
    return { error: null, data:reportData};
  } catch (error) {
    return { error, data: null };
  }
};





