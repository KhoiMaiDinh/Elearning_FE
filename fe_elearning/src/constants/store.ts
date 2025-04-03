import { configureStore } from "@reduxjs/toolkit";
import createUserSlice from "./userSlice";
import createCourseSlice from "./course";

const store = configureStore({
  reducer: {
    user: createUserSlice,
    course: createCourseSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
