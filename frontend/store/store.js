import { configureStore } from "@reduxjs/toolkit";
import habitsReducer from "../features/habitsSlice";

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
  },
});