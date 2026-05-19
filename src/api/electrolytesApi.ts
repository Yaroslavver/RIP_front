import { Electrolyte } from '../mock/electrolytes';
import { mockElectrolytes } from '../mock/electrolytes';
import { API_BASE_URL } from '../config/runtime';

async function fetchWithFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    // Предполагаем, что бэкенд возвращает { data: ... }
    return json.data ?? json;
  } catch (err) {
    console.warn(`Fallback to mock for ${url}`, err);
    return fallback;
  }
}

export const getElectrolytes = async (search = ''): Promise<Electrolyte[]> => {
  const url = search ? `${API_BASE_URL}/electrolytes?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/electrolytes`;
  // fallback – фильтруем мок по названию
  const fallback = search
    ? mockElectrolytes.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : mockElectrolytes;
  return fetchWithFallback<Electrolyte[]>(url, fallback);
};

export const getElectrolyteById = async (id: number): Promise<Electrolyte | null> => {
  const url = `${API_BASE_URL}/electrolytes/${id}`;
  const fallback = mockElectrolytes.find(e => e.id === id) || null;
  return fetchWithFallback<Electrolyte | null>(url, fallback);
};

export const getCartInfo = async (): Promise<{ draft_id: number; count: number }> => {
  const url = `${API_BASE_URL}/cart`;
  const fallback = { draft_id: 0, count: 0 };
  return fetchWithFallback(url, fallback);
};
