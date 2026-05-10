// src/testUtils/renderWithStore.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Import your real reducers
import appointmentsReducer from '../features/appointments/appointmentsSlice';
import authReducer from '../features/auth/authSlice'; 
import thunk from 'redux-thunk';
const rootReducer = combineReducers({
  appointments: appointmentsReducer,
  auth: authReducer,
});

export function renderWithStore(ui: React.ReactNode, preloadedState?: any) {
  const store = configureStore({
    reducer: rootReducer, 
    preloadedState,
  });

  return {
    store,  
    ...render(<Provider store={store}>{ui}</Provider>)
  };
}

 
 