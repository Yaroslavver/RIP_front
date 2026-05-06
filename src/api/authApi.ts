import axios from 'axios';

const authHttp = axios.create({ baseURL: '/api' });

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const loginRequest = (login: string, password: string) =>
  authHttp.post<AuthResponse>('/login', { login, password });

export const registerRequest = (login: string, password: string) =>
  authHttp.post('/register', { login, password });

export const logoutRequest = (token: string) =>
  authHttp.post('/logout', undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
