import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const fetchCompliance = createAsyncThunk(
    'compliance/fetchCompliance',
    async (farmId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/compliance/${farmId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch compliance');
        }
    }
);

export const toggleComplianceItem = createAsyncThunk(
    'compliance/toggleItem',
    async ({ farmId, itemId, notes }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/compliance/${farmId}/item/${itemId}`, { notes });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item');
        }
    }
);

const initialState = {
    compliance: null,
    loading: false,
    error: null,
};

const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch compliance
            .addCase(fetchCompliance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompliance.fulfilled, (state, action) => {
                state.loading = false;
                state.compliance = action.payload.compliance;
            })
            .addCase(fetchCompliance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Toggle item
            .addCase(toggleComplianceItem.fulfilled, (state, action) => {
                state.compliance = action.payload.compliance;
            });
    },
});

export const { clearError } = complianceSlice.actions;
export default complianceSlice.reducer;
