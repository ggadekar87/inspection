// src/features/auth/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from './authSlice';
import * as api from '../../api/auth.api';
import type { RootState } from '../../app/store';
import { useCallback } from 'react';

export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.auth);

  const login = useCallback(async (username: string, password: string) => {
    dispatch(loginStart());
    try {
      const user = await api.loginApi(username, password);
      dispatch(loginSuccess({ name: user.name, role: user.role, token: user.token }));
      localStorage.setItem('auth', JSON.stringify({ name: user.name, role: user.role, token: user.token }));
      return user;
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Login failed'));
      throw err;
    }
  }, [dispatch]);

  const signup = useCallback(async (username: string, password: string, role: api.Role) => {
    dispatch(loginStart());
    try {
      const user = await api.signupApi(username, password, role);
      dispatch(loginSuccess({ name: user.name, role: user.role, token: user.token }));
      localStorage.setItem('auth', JSON.stringify({ name: user.name, role: user.role, token: user.token }));
      return user;
    } catch (err: any) {
      dispatch(loginFailure(err.message || 'Signup failed'));
      throw err;
    }
  }, [dispatch]);

  const doLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('auth');
  }, [dispatch]);

  return { auth, login, signup, logout: doLogout };
}
