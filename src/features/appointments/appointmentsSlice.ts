// src/features/appointments/appointmentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as api from '../../api/appointments.api';


export type Appointment = api.Appointment;

export const fetchAppointments = createAsyncThunk(
  'appointments/fetch',
  async (params: Parameters<typeof api.fetchAppointments>[0]) => {
    const res = await api.fetchAppointments(params);
    return res;
  }
);

export const createAppointment = createAsyncThunk('appointments/create', async (payload: Partial<Appointment>) => {
  const res = await api.createAppointment(payload);
  return res;
});

export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async ({ id, patch }: { id: string; patch: Partial<Appointment> }) => {
    const res = await api.updateAppointment(id, patch);
    return res;
  }
);

interface State {
  items: Appointment[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAppointments.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(fetchAppointments.fulfilled, (s, a: PayloadAction<{ data: Appointment[]; total: number }>) => {
      s.loading = false;
      s.items = a.payload.data;
      s.total = a.payload.total;
    });
    builder.addCase(fetchAppointments.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to fetch';
    });

    builder.addCase(createAppointment.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(createAppointment.fulfilled, (s, a: PayloadAction<Appointment>) => {
      s.loading = false;
      s.items = [a.payload, ...s.items];
      s.total = s.total + 1;
    });
    builder.addCase(createAppointment.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to create';
    });

    builder.addCase(updateAppointment.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(updateAppointment.fulfilled, (s, a: PayloadAction<Appointment>) => {
      s.loading = false;
      s.items = s.items.map((it) => (it.id === a.payload.id ? a.payload : it));
    });
    builder.addCase(updateAppointment.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message ?? 'Failed to update';
    });
  },
});

export default slice.reducer;
