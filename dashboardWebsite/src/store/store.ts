import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userFieldReducer from './userFieldSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    field: userFieldReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
