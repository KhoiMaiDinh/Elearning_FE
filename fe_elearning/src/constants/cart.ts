// 'use client'
import { Section } from "@/types/courseType";
import { Lecture } from "@/types/registerLectureFormType";
import { FileData, Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  student: {
    username: "",
    email: "",
  },
};

const createCartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload ?? state.products;
    },
    clearProducts: (state, action) => {
      state.products = initialState.products;
    },
  },
});

export const { setProducts, clearProducts } = createCartSlice.actions;
export default createCartSlice.reducer;
