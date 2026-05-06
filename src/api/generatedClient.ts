import { Api } from './generated/electrolyteSwaggerApi';

export const generatedApi = new Api<string>({
  baseURL: '/api',
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
