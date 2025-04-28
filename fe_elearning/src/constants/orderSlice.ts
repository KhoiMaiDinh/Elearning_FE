import { OrderResponse } from "@/types/billType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: <OrderResponse[]>[],
};

const createOrderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload ?? state.orders;
    },
    clearOrders: (state, action) => {
      state.orders = initialState.orders;
    },
  },
});

export const { setOrders, clearOrders } = createOrderSlice.actions;
export default createOrderSlice.reducer;
