import axios from 'axios';
import { API_BASE_URL } from '../config/runtime';

const authHttp = axios.create({ baseURL: API_BASE_URL });

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
