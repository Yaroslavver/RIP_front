import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getElectrolytes } from '../api/servicesApi';
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

export const loadElectrolyteServices = createAsyncThunk(
  'services/loadElectrolyteServices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { services: ServicesState };
      return await getElectrolytes(state.services.search);
    } catch {
      return rejectWithValue('Не удалось загрузить растворы');
    }
  },
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServicesSearch(state, action: { payload: string }) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadElectrolyteServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadElectrolyteServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadElectrolyteServices.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload ?? action.error.message);
      });
  },
});

export const { setServicesSearch } = servicesSlice.actions;
export default servicesSlice.reducer;
