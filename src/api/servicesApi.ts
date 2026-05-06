import axios from 'axios';
import { mockElectrolytes } from '../mock/electrolytes';
import type { CartInfo, Electrolyte } from '../types';

const serviceHttp = axios.create({ baseURL: '/api' });

const normalizeElectrolytes = (payload: unknown): Electrolyte[] => {
  const source = (payload as { data?: unknown })?.data ?? payload;
  return Array.isArray(source) ? (source as Electrolyte[]) : [];
};

export const getElectrolytes = async (search = ''): Promise<Electrolyte[]> => {
  try {
    const response = await serviceHttp.get('/electrolytes', {
      params: search ? { search } : undefined,
    });
    return normalizeElectrolytes(response.data);
  } catch {
    return search
      ? mockElectrolytes.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        )
      : mockElectrolytes;
  }
};

export const getElectrolyteById = async (id: number): Promise<Electrolyte | null> => {
  try {
    const response = await serviceHttp.get(`/electrolytes/${id}`);
    return ((response.data as { data?: Electrolyte }).data ?? response.data) as Electrolyte;
  } catch {
    return mockElectrolytes.find((item) => item.id === id) ?? null;
  }
};

export const getCartInfo = async (token?: string | null): Promise<CartInfo> => {
  try {
    const response = await serviceHttp.get('/cart', {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data as CartInfo;
  } catch {
    return { draft_id: 0, count: 0 };
  }
};
