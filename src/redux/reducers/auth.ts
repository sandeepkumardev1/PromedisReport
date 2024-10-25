import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  accessCode: null,
  signInError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userData = action.payload;
      state.signInError = null
    },
    setAccessCode: (state, action) => {
      state.accessCode = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    loginFail: (state, action) => {
      state.signInError = action.payload;
    },
    clearMessage:(state) => {
      state.signInError = null;
    },
    logoutSuccess: (state) => {
      state.userData = null;
      state.accessCode = null;
      state.signInError = null;
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  loginFail,
  setAccessCode,
  setUserData,
  clearMessage
} = authSlice.actions;

export default authSlice.reducer;
