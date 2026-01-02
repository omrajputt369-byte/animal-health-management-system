import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import farmReducer from './farmSlice';
import assessmentReducer from './assessmentSlice';
import alertReducer from './alertSlice';
import complianceReducer from './complianceSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        farm: farmReducer,
        assessment: assessmentReducer,
        alert: alertReducer,
        compliance: complianceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // For handling dates and other non-serializable data
        }),
});

export default store;

