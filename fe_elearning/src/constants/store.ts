// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage
import createUserSlice from "./userSlice";
import createCourseSlice from "./course";
import createBankAccountSlice from "./bankAccount";
// Cấu hình persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "course", "bankAccount"], // Chỉ lưu slice `user`, có thể thêm `course` nếu muốn
};

// Combine các slice reducer
const rootReducer = combineReducers({
  user: createUserSlice,
  course: createCourseSlice,
  bankAccount: createBankAccountSlice,
});

// Tạo reducer đã persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // cần thiết để redux-persist hoạt động mượt mà
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export default store;
