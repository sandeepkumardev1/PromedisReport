export const signIn = async (formData: FormData) => {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const url = `/api/ReportsManagement.svc/rest/ValidateLogin?LoginName=${username}&Password=${password}`;
    const response = await fetch(url, options);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    return { error: { message: "Invalid Crendentials" }, data: null };
  }
};

export const getAccessCode = async (userData: any) => {
  try {
    const url = `/api/ReportsManagement.svc/rest/GetPromedisSecurityID?IDEmployee=${userData.idEmployee}&EmployeeCode=${userData.EmployeeCode}&UserName=${userData.UserName}&Password=${userData.Password}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, options);
    const data = await response.text();
    return { error: null, data:JSON.parse(data) };
  } catch (error: any) {
    return { error: error, data: null };
  }
};
