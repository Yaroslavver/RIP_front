import { Api } from './generated/electrolyteSwaggerApi';
import { API_BASE_URL } from '../config/runtime';

export const generatedApi = new Api<string>({
  baseURL: API_BASE_URL,
  securityWorker: (token) =>
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
});

export const syncGeneratedApiToken = () => {
  generatedApi.setSecurityData(localStorage.getItem('electrolyte_token'));
};
