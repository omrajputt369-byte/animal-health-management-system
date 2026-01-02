import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const fetchFarms = createAsyncThunk(
    'farm/fetchFarms',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/farms');
            return response.data.data.farms;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch farms');
        }
    }
);

export const createFarm = createAsyncThunk(
    'farm/createFarm',
    async (farmData, { rejectWithValue }) => {
        try {
            const response = await api.post('/farms', farmData);
            return response.data.data.farm;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create farm');
        }
    }
);

export const updateFarm = createAsyncThunk(
    'farm/updateFarm',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/farms/${id}`, data);
            return response.data.data.farm;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update farm');
        }
    }
);

const initialState = {
    farms: [],
    currentFarm: null,
    loading: false,
    error: null,
};

const farmSlice = createSlice({
    name: 'farm',
    initialState,
    reducers: {
        setCurrentFarm: (state, action) => {
            state.currentFarm = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch farms
            .addCase(fetchFarms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFarms.fulfilled, (state, action) => {
                state.loading = false;
                state.farms = action.payload;
                if (action.payload.length > 0 && !state.currentFarm) {
                    state.currentFarm = action.payload[0];
                }
            })
            .addCase(fetchFarms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create farm
            .addCase(createFarm.fulfilled, (state, action) => {
                state.farms.push(action.payload);
                state.currentFarm = action.payload;
            })
            // Update farm
            .addCase(updateFarm.fulfilled, (state, action) => {
                const index = state.farms.findIndex(f => f._id === action.payload._id);
                if (index !== -1) {
                    state.farms[index] = action.payload;
                }
                if (state.currentFarm?._id === action.payload._id) {
                    state.currentFarm = action.payload;
                }
            });
    },
});

export const { setCurrentFarm, clearError } = farmSlice.actions;
export default farmSlice.reducer;
