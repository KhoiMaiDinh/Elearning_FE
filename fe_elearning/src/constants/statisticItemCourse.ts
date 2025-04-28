// 'use client'
import { Lecture } from "@/types/registerLectureFormType";
import { FileData, Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statisticItemCourse: {
    instructor_quality: {
      positive: 0,
      neutral: 0,
      negative: 0,
      none: 0,
    },
    content_quality: {
      positive: 0,
      neutral: 0,
      negative: 0,
      none: 0,
    },
    technology: {
      positive: 0,
      neutral: 0,
      negative: 0,
      none: 0,
    },
  },
};

const createStatisticItemCourseSlice = createSlice({
  name: "statisticItemCourseSlice",
  initialState,
  reducers: {
    setStatisticItemCourse: (state, action) => {
      state.statisticItemCourse = action.payload ?? state.statisticItemCourse;
    },
    clearStatisticItemCourse: (state, action) => {
      state.statisticItemCourse = initialState.statisticItemCourse;
    },
  },
});

export const { setStatisticItemCourse, clearStatisticItemCourse } =
  createStatisticItemCourseSlice.actions;
export default createStatisticItemCourseSlice.reducer;
