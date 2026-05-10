// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import appointmentsReducer from '../features/appointments/appointmentsSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
