import { configureStore } from '@reduxjs/toolkit';
import { examSlice } from './slices';

const store = configureStore({
  reducer: {
    exam: examSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
