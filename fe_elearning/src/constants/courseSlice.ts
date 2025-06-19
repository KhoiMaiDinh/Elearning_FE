// 'use client'
import { CourseProgress, Section } from '@/types/courseType';
import { Lecture } from '@/types/registerLectureFormType';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courseInfo: {
    id: '',
    title: '',
    subtitle: '',
    description: '',
    level: '',
    status: '',

    price: 0,

    thumbnail: {
      key: '',
      id: '',
    },

    category: {
      slug: '',
      name: '',
      children: [
        {
          slug: '',
          name: '',
          translations: [],
        },
      ],
      parent: {
        slug: '',
        name: '',
        translations: [],
      },
      translations: [],
    },
    createdAt: '',
    updatedAt: '',
    published_at: '',
    instructor_profile: <Lecture | null>null,
    sections: <Section[]>[],
    course_progress: <CourseProgress | null>null,
    avg_rating: 0,
    total_enrolled: 0,
  },
};

const createCourseSlice = createSlice({
  name: 'courseSlice',
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.courseInfo = action.payload ?? state.courseInfo;
    },
    clearCourse: (state, _action) => {
      state.courseInfo = initialState.courseInfo;
    },
    clearSection: (state, _action) => {
      state.courseInfo.sections = [];
    },
  },
});

export const { setCourse, clearCourse, clearSection } = createCourseSlice.actions;
export default createCourseSlice.reducer;
