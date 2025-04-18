// 'use client'

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bankAccountInfo: {
    id: "",
    label: "",
    country_code: "",
  },
};

const createBankAccountSlice = createSlice({
  name: "bankAccountSlice",
  initialState,
  reducers: {
    setBankAccount: (state, action) => {
      state.bankAccountInfo = action.payload ?? state.bankAccountInfo;
    },
    clearBankAccount: (state, action) => {
      state.bankAccountInfo = initialState.bankAccountInfo;
    },
  },
});

export const { setBankAccount, clearBankAccount } =
  createBankAccountSlice.actions;
export default createBankAccountSlice.reducer;
