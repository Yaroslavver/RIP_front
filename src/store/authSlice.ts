import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginRequest, logoutRequest, registerRequest } from '../api/authApi';
import { syncGeneratedApiToken } from '../api/generatedClient';
import type { CurrentUser } from '../types';
import { resetDraftState, resetRequestFilters } from './requestsSlice';

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

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: { login: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginRequest(payload.login, payload.password);
      return { token: response.data.access_token, login: payload.login };
    } catch {
      return rejectWithValue('Не удалось выполнить вход');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload: { login: string; password: string }, { rejectWithValue }) => {
    try {
      await registerRequest(payload.login, payload.password);
      const response = await loginRequest(payload.login, payload.password);
      return { token: response.data.access_token, login: payload.login };
    } catch {
      return rejectWithValue('Не удалось зарегистрироваться');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { getState, dispatch }) => {
  const state = getState() as { auth: AuthState };
  if (state.auth.token) {
    await logoutRequest(state.auth.token).catch(() => undefined);
  }
  dispatch(resetDraftState());
  dispatch(resetRequestFilters());
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = decodeUser(action.payload.token, action.payload.login);
        localStorage.setItem('electrolyte_token', action.payload.token);
        localStorage.setItem('electrolyte_login', action.payload.login);
        syncGeneratedApiToken();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = decodeUser(action.payload.token, action.payload.login);
        localStorage.setItem('electrolyte_token', action.payload.token);
        localStorage.setItem('electrolyte_login', action.payload.login);
        syncGeneratedApiToken();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('electrolyte_token');
        localStorage.removeItem('electrolyte_login');
        syncGeneratedApiToken();
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
