import { createSlice } from '@reduxjs/toolkit';
import { syncGeneratedApiToken } from '../api/generatedClient';
import type { CurrentUser } from '../types';

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
}

const decodeUser = (token: string, login: string): CurrentUser => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as {
      user_id?: number;
      is_moderator?: boolean;
    };
    return {
      id: payload.user_id ?? 0,
      login,
      isModerator: Boolean(payload.is_moderator),
    };
  } catch {
    return { id: 0, login, isModerator: false };
  }
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    authRequestStarted(state) {
      state.loading = true;
      state.error = null;
    },
    authRequestFailed(state, action: { payload: string }) {
      state.loading = false;
      state.error = action.payload;
    },
    authSucceeded(state, action: { payload: { token: string; login: string } }) {
      state.loading = false;
      state.token = action.payload.token;
      state.user = decodeUser(action.payload.token, action.payload.login);
      localStorage.setItem('electrolyte_token', action.payload.token);
      localStorage.setItem('electrolyte_login', action.payload.login);
      syncGeneratedApiToken();
    },
    logoutSucceeded(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('electrolyte_token');
      localStorage.removeItem('electrolyte_login');
      syncGeneratedApiToken();
    },
  },
});

export const { authRequestFailed, authRequestStarted, authSucceeded, clearAuthError, logoutSucceeded } = authSlice.actions;
export default authSlice.reducer;
