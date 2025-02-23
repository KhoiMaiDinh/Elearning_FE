import { configureStore } from "@reduxjs/toolkit";
import createUserSlice from "./userSlice";

const store = configureStore({
  reducer: {
    user: createUserSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
