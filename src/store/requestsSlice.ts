import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { generatedApi, syncGeneratedApiToken } from '../api/generatedClient';
import { getCartInfo } from '../api/servicesApi';
import type { CartInfo, Concentration, ConcentrationDetails, RequestFilters } from '../types';

export const STATUS = {
  draft: 'черновик',
  formed: 'сформирован',
  finished: 'завершён',
  rejected: 'отклонён',
  deleted: 'удалён',
} as const;

export const statusLabel = (status: string) =>
  ({
    [STATUS.draft]: 'черновик',
    [STATUS.formed]: 'сформирован',
    [STATUS.finished]: 'завершен',
    [STATUS.rejected]: 'отклонен',
    [STATUS.deleted]: 'удален',
  })[status] ?? status;

const isStatusLike = (status: string | undefined, variants: string[]) => {
  const value = status ?? '';
  const label = statusLabel(value);
  return variants.some((variant) => value === variant || label === variant);
};

export const isDraftStatus = (status?: string) => isStatusLike(status, [STATUS.draft]);
export const isFormedStatus = (status?: string) => isStatusLike(status, [STATUS.formed]);

const today = new Date().toISOString().slice(0, 10);

interface RequestsState {
  cart: CartInfo;
  current: ConcentrationDetails;
  list: Concentration[];
  filters: RequestFilters;
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  cart: { draft_id: 0, count: 0 },
  current: { concentration: null, items: [] },
  list: [],
  filters: { status: '', from: today, to: today, creator: '' },
  loading: false,
  error: null,
};

const listFromResponse = (payload: unknown): Concentration[] => {
  const source = (payload as { data?: unknown })?.data ?? payload;
  return Array.isArray(source) ? (source as Concentration[]) : [];
};

export const loadCartInfo = createAsyncThunk('requests/loadCartInfo', async (_, { getState }) => {
  const state = getState() as { auth: { token: string | null } };
  return getCartInfo(state.auth.token);
});

export const addElectrolyteToDraft = createAsyncThunk(
  'requests/addElectrolyteToDraft',
  async (payload: { electrolyte_id: number }, { rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.cart.itemsCreate(payload);
      return getCartInfo(localStorage.getItem('electrolyte_token'));
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 400 &&
        String((error.response.data as { error?: string })?.error ?? '').includes('already in draft')
      ) {
        return getCartInfo(localStorage.getItem('electrolyte_token'));
      }
      return rejectWithValue('Не удалось добавить раствор в концентрацию');
    }
  },
);

export const loadConcentrationRequest = createAsyncThunk(
  'requests/loadConcentrationRequest',
  async (id: number, { rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      const response = await generatedApi.concentrations.concentrationsDetail(id);
      return response.data as ConcentrationDetails;
    } catch {
      return rejectWithValue('Не удалось открыть концентрацию');
    }
  },
);

export const updateRequestItem = createAsyncThunk(
  'requests/updateRequestItem',
  async (payload: { requestId: number; itemId: number; volume: number }, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.cart.itemsUpdate(payload.itemId, {
        volume: payload.volume,
        comment: '',
      });
      await dispatch(loadConcentrationRequest(payload.requestId));
    } catch {
      return rejectWithValue('Не удалось изменить раствор в концентрации');
    }
  },
);

export const deleteRequestItem = createAsyncThunk(
  'requests/deleteRequestItem',
  async (payload: { requestId: number; itemId: number }, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.cart.itemsDelete(payload.itemId);
      await dispatch(loadConcentrationRequest(payload.requestId));
      return getCartInfo(localStorage.getItem('electrolyte_token'));
    } catch {
      return rejectWithValue('Не удалось удалить раствор из концентрации');
    }
  },
);

export const updateConcentrationDescription = createAsyncThunk(
  'requests/updateConcentrationDescription',
  async (payload: { requestId: number; result?: string; description?: string }, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      const request: { result?: string; description?: string } = {
        description: payload.description ?? '',
      };
      if (payload.result !== undefined) {
        request.result = payload.result;
      }
      await generatedApi.concentrations.concentrationsUpdate(payload.requestId, request);
      await dispatch(loadConcentrationRequest(payload.requestId));
    } catch {
      return rejectWithValue('Не удалось изменить концентрацию');
    }
  },
);

export const formConcentrationRequest = createAsyncThunk(
  'requests/formConcentrationRequest',
  async (requestId: number, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.concentrations.formedUpdate(requestId);
      await dispatch(loadConcentrationRequest(requestId));
      return getCartInfo(localStorage.getItem('electrolyte_token'));
    } catch {
      return rejectWithValue('Не удалось сформировать концентрацию');
    }
  },
);

export const deleteConcentrationRequest = createAsyncThunk(
  'requests/deleteConcentrationRequest',
  async (requestId: number, { rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.concentrations.concentrationsDelete(requestId);
      return { draft_id: 0, count: 0 } as CartInfo;
    } catch {
      return rejectWithValue('Не удалось удалить концентрацию');
    }
  },
);

export const loadConcentrationRequests = createAsyncThunk(
  'requests/loadConcentrationRequests',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { requests: RequestsState; auth: { user: { isModerator: boolean } | null } };
      const { status, from, to } = state.requests.filters;
      syncGeneratedApiToken();
      const query = { status: status || undefined, from: from || undefined, to: to || undefined };
      const response = state.auth.user?.isModerator
        ? await generatedApi.concentrations.getConcentrations(query)
        : await generatedApi.concentrations.concentrationsList(query);
      return listFromResponse(response.data);
    } catch {
      return rejectWithValue('Не удалось загрузить список концентраций');
    }
  },
);

export const finishConcentrationRequest = createAsyncThunk(
  'requests/finishConcentrationRequest',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.concentrations.finishUpdate(id);
      await dispatch(loadConcentrationRequest(id));
      await dispatch(loadConcentrationRequests());
    } catch {
      return rejectWithValue('Не удалось завершить концентрацию');
    }
  },
);

export const rejectConcentrationRequest = createAsyncThunk(
  'requests/rejectConcentrationRequest',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      syncGeneratedApiToken();
      await generatedApi.concentrations.rejectUpdate(id);
      await dispatch(loadConcentrationRequest(id));
      await dispatch(loadConcentrationRequests());
    } catch {
      return rejectWithValue('Не удалось отклонить концентрацию');
    }
  },
);

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequestFilters(state, action: { payload: Partial<RequestFilters> }) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetRequestFilters(state) {
      state.filters = { status: '', from: today, to: today, creator: '' };
    },
    resetDraftState(state) {
      state.cart = { draft_id: 0, count: 0 };
      state.current = { concentration: null, items: [] };
    },
  },
  extraReducers: (builder) => {
    const setPending = (state: RequestsState) => {
      state.loading = true;
      state.error = null;
    };
    const setError = (state: RequestsState, action: { payload?: unknown; error?: { message?: string } }) => {
      state.loading = false;
      state.error = String(action.payload ?? action.error?.message ?? 'Ошибка запроса');
    };
    builder
      .addCase(loadCartInfo.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addElectrolyteToDraft.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(loadConcentrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(loadConcentrationRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(deleteRequestItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(formConcentrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(deleteConcentrationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.current = { concentration: null, items: [] };
      })
      .addMatcher((action) => action.type.startsWith('requests/') && action.type.endsWith('/pending'), setPending)
      .addMatcher((action) => action.type.startsWith('requests/') && action.type.endsWith('/rejected'), setError)
      .addMatcher((action) => action.type.startsWith('requests/') && action.type.endsWith('/fulfilled'), (state) => {
        state.loading = false;
      });
  },
});

export const { resetDraftState, resetRequestFilters, setRequestFilters } = requestsSlice.actions;
export default requestsSlice.reducer;
