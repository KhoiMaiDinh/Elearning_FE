// 'use client'
import { LectureComment } from '@/types/commentType';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comment: <LectureComment[]>{},
};

const createCommentSlice = createSlice({
  name: 'commentSlice',
  initialState,
  reducers: {
    setComment: (state, action) => {
      state.comment = action.payload ?? state.comment;
    },
    clearComment: (state, _action) => {
      state.comment = initialState.comment;
    },
  },
});

export const { setComment, clearComment } = createCommentSlice.actions;
export default createCommentSlice.reducer;
