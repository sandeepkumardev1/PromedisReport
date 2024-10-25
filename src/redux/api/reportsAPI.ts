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