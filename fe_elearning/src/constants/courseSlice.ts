// 'use client'
import { InstructorType } from '@/types/instructorType';
import { CouponType } from '@/types/couponType';
import { CourseProgress, SectionType } from '@/types/courseType';
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
    instructor_profile: <InstructorType | null>null,
    sections: <SectionType[]>[],
    course_progress: <CourseProgress | null>null,
    avg_rating: 0,
    total_enrolled: 0,
    coupons: <CouponType[]>[],
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
