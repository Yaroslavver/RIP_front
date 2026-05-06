import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import servicesReducer from './servicesSlice';
import requestsReducer from './requestsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    requests: requestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
