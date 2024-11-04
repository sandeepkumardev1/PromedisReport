import { BASE_URL } from "../../constants/urls";

export const signIn = async (formData: FormData) => {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    const url = `${BASE_URL}/ReportsManagement.svc/rest/ValidateLogin?LoginName=${username}&Password=${password}`;
    const response = await fetch(url);
    const data = await response.json();
    return { error: null, data };
  } catch (error: any) {
    console.log(error)
    return { error: { message: "Invalid Crendentials" }, data: null };
  }
};

export const getAccessCode = async (userData: any) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/GetPromedisSecurityID?IDEmployee=${userData.idEmployee}&EmployeeCode=${userData.EmployeeCode}&UserName=${userData.UserName}&Password=${userData.Password}`;
    const response = await fetch(url);
    const data = await response.text();
    return { error: null, data: JSON.parse(data) };
  } catch (error: any) {
    return { error: error, data: null };
  }
};

export const getLicensedName = async (securityId: string) => {
  try {
    const url = `${BASE_URL}/ReportsManagement.svc/rest/GetLicensedToName?securityID=${securityId}`;
    const response = await fetch(url);
    const data = await response.text();
    return { error: null, data: JSON.parse(data) };
  } catch (error: any) {
    return { error: error, data: null };
  }
};
