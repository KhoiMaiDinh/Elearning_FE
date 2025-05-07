// 'use client'
import { Lecture } from "@/types/registerLectureFormType";
import { FileData, Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    username: "",
    profile_image: <FileData>{},
    id: "",
    roles: <Roles[]>{},
    email: "",
    createdAt: "",
    first_name: "",
    last_name: "",
    instructor_profile: <Lecture | null>null,
  },
};

const createUserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload ?? state.userInfo;
    },
    clearUser: (state) => {
      state.userInfo = initialState.userInfo;
    },
  },
});

export const { setUser, clearUser } = createUserSlice.actions;
export default createUserSlice.reducer;
