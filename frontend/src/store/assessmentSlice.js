import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const submitAssessment = createAsyncThunk(
    'assessment/submit',
    async (assessmentData, { rejectWithValue }) => {
        try {
            const response = await api.post('/assessments', assessmentData);
            return response.data.data.assessment;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit assessment');
        }
    }
);

export const fetchAssessments = createAsyncThunk(
    'assessment/fetchAll',
    async (farmId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/assessments?farmId=${farmId}`);
            return response.data.data.assessments;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch assessments');
        }
    }
);

const initialState = {
    assessments: [],
    currentAssessment: null,
    questionnaire: [],
    responses: [],
    loading: false,
    error: null,
};

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState,
    reducers: {
        setQuestionnaire: (state, action) => {
            state.questionnaire = action.payload;
        },
        addResponse: (state, action) => {
            const existingIndex = state.responses.findIndex(
                r => r.questionId === action.payload.questionId
            );
            if (existingIndex !== -1) {
                state.responses[existingIndex] = action.payload;
            } else {
                state.responses.push(action.payload);
            }
        },
        clearResponses: (state) => {
            state.responses = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit assessment
            .addCase(submitAssessment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAssessment.fulfilled, (state, action) => {
                state.loading = false;
                state.currentAssessment = action.payload;
                state.assessments.unshift(action.payload);
                state.responses = [];
            })
            .addCase(submitAssessment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch assessments
            .addCase(fetchAssessments.fulfilled, (state, action) => {
                state.assessments = action.payload;
                if (action.payload.length > 0) {
                    state.currentAssessment = action.payload[0];
                }
            });
    },
});

export const { setQuestionnaire, addResponse, clearResponses, clearError } = assessmentSlice.actions;
export default assessmentSlice.reducer;
