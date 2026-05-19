import { createSlice } from '@reduxjs/toolkit';
import type { Electrolyte } from '../types';

interface ServicesState {
  items: Electrolyte[];
  search: string;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  items: [],
  search: '',
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServicesSearch(state, action: { payload: string }) {
      state.search = action.payload;
    },
    loadServicesStart(state) {
      state.loading = true;
      state.error = null;
    },
    loadServicesSuccess(state, action: { payload: Electrolyte[] }) {
      state.loading = false;
      state.items = action.payload;
    },
    loadServicesError(state, action: { payload: string }) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { loadServicesError, loadServicesStart, loadServicesSuccess, setServicesSearch } = servicesSlice.actions;
export default servicesSlice.reducer;
