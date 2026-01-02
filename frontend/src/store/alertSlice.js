import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const fetchNearbyAlerts = createAsyncThunk(
    'alert/fetchNearby',
    async (farmId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/alerts/nearby?farmId=${farmId}`);
            return response.data.data.alerts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
        }
    }
);

export const fetchAllAlerts = createAsyncThunk(
    'alert/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/alerts');
            return response.data.data.alerts;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch alerts');
        }
    }
);

const initialState = {
    alerts: [],
    nearbyAlerts: [],
    loading: false,
    error: null,
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch nearby alerts
            .addCase(fetchNearbyAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNearbyAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.nearbyAlerts = action.payload;
            })
            .addCase(fetchNearbyAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch all alerts
            .addCase(fetchAllAlerts.fulfilled, (state, action) => {
                state.alerts = action.payload;
            });
    },
});

export const { clearError } = alertSlice.actions;
export default alertSlice.reducer;
