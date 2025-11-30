import { configureStore } from "@reduxjs/toolkit";
import driveSlice from "./driveSlice";

export const store = configureStore({
  reducer: {
    drive: driveSlice,
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
