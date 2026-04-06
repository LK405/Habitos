import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "../features/habitsSlice";
import userReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    user: userReducer,
  },
});