import { createSlice } from '@reduxjs/toolkit';
import { checkOnboardingStatus } from '../thunk/surveyThunk';

const initialState = {
  isOnboardingCompleted: null,
  surveyData: null,
  loading: false,
  error: null,
  currentStep: 1,
  maxStep: 5, // SelectTypeAccount, height, weight, age, gender
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.maxStep) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    resetOnboarding: (state) => {
      state.currentStep = 1;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingCompleted: (state, action) => {
      state.isOnboardingCompleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOnboardingStatus.pending, (state) => {
        console.log('surveySlice - checkOnboardingStatus pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        console.log('surveySlice - checkOnboardingStatus fulfilled:', action.payload);
        state.loading = false;
        // Xử lý đúng structure của API response
        if (action.payload && action.payload.data) {
          state.isOnboardingCompleted = action.payload.data.isOnboardingCompleted;
          state.surveyData = action.payload.data;
          console.log('surveySlice - Updated isOnboardingCompleted:', state.isOnboardingCompleted);
        }
      })
      .addCase(checkOnboardingStatus.rejected, (state, action) => {
        console.log('surveySlice - checkOnboardingStatus rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCurrentStep, 
  nextStep, 
  prevStep, 
  resetOnboarding, 
  clearError,
  setOnboardingCompleted 
} = surveySlice.actions;

export default surveySlice.reducer;
