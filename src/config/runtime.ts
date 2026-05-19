const trimTrailingSlash = (value: string) => value.replace(/\/$/, '');

export const API_ORIGIN = trimTrailingSlash(import.meta.env.VITE_API_ORIGIN ?? '');
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';
export const APP_BASENAME = trimTrailingSlash(import.meta.env.BASE_URL ?? '/');
export const GUEST_ONLY = import.meta.env.VITE_GUEST_ONLY === 'true';
