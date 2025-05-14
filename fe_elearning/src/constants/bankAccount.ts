// 'use client'

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bankAccountInfo: {
    name: '',
    bank_code: '',
    bank_account_number: '',
  },
};

const createBankAccountSlice = createSlice({
  name: 'bankAccountSlice',
  initialState,
  reducers: {
    setBankAccount: (state, action) => {
      state.bankAccountInfo = action.payload ?? state.bankAccountInfo;
    },
    clearBankAccount: (state, _action) => {
      state.bankAccountInfo = initialState.bankAccountInfo;
    },
  },
});

export const { setBankAccount, clearBankAccount } = createBankAccountSlice.actions;
export default createBankAccountSlice.reducer;
