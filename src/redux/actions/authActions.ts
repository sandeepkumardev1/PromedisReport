import {
  loginFail,
  loginSuccess,
  logoutSuccess,
  setAccessCode,
  setLicensedName,
  setUserData,
} from "../reducers/auth";
import * as api from "../api/authAPI";
import secureLocalStorage from "react-secure-storage";

export const initializeAuth = () => async (dispatch: any) => {
  const accessCode = JSON.parse(
    secureLocalStorage.getItem("accessCode") as string
  );
  const userData = JSON.parse(secureLocalStorage.getItem("profile") as string);
  const sessionId: string | null = sessionStorage.getItem("sessionId");
  const licensedName: string | null = sessionStorage.getItem("licensedName");

  if (userData && sessionId && licensedName) {
    dispatch(setUserData(userData));
    dispatch(setAccessCode(accessCode));
    dispatch(setLicensedName(licensedName));
  }
};

export const signInAction: any =
  (formData: FormData, navigate: any) => async (dispatch: any) => {
    try {
      const { data, error } = await api.signIn(formData);
      if (error) {
        dispatch(loginFail(error.message));
      } else {
        const accessCode = await api.getAccessCode(data);
        const licensedName = await api.getLicensedName(accessCode.data);
        secureLocalStorage.setItem("profile", JSON.stringify(data));
        secureLocalStorage.setItem(
          "accessCode",
          JSON.stringify(accessCode.data)
        );
        sessionStorage.setItem("sessionId", crypto.randomUUID());
        sessionStorage.setItem("licensedName", licensedName.data);
        dispatch(loginSuccess(data));
        dispatch(setAccessCode(accessCode.data));
        dispatch(setLicensedName(licensedName.data));
        navigate("/reports");
      }
    } catch (error: any) {
      await dispatch(loginFail(error.message));
      navigate("/");
    }
  };

export const logoutAction: any = () => async (dispatch: any) => {
  secureLocalStorage.removeItem("profile");
  secureLocalStorage.removeItem("accessCode");
  dispatch(logoutSuccess());
};
