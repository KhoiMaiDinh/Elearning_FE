// 'use client'
import { CommentEachItemCourse } from "@/types/commentType";
import { Lecture } from "@/types/registerLectureFormType";
import { FileData, Roles } from "@/types/userType";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comment: <CommentEachItemCourse[]>{},
};

const createCommentSlice = createSlice({
  name: "commentSlice",
  initialState,
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload ?? state.comment;
    },
    clearComment: (state, action) => {
      state.comment = initialState.comment;
    },
  },
});

export const { setComment, clearComment } = createCommentSlice.actions;
export default createCommentSlice.reducer;
