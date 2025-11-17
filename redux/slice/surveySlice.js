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
    // Reset onboarding check flag khi user thay đổi
    resetOnboardingCheck: (state) => {
      state.isOnboardingCompleted = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOnboardingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOnboardingStatus.fulfilled, (state, action) => {
        console.log('Survey Response:', action.payload);
        state.loading = false;
        if (action.payload && action.payload.data) {
          state.isOnboardingCompleted = action.payload.data.isOnboardingCompleted;
          state.surveyData = action.payload.data;
        }
      })
      .addCase(checkOnboardingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Nếu có lỗi 429, set completed = null để không redirect
        state.isOnboardingCompleted = null;
      });
  },
});

export const { 
  setCurrentStep, 
  nextStep, 
  prevStep, 
  resetOnboarding, 
  clearError,
  setOnboardingCompleted,
  resetOnboardingCheck
} = surveySlice.actions;

export default surveySlice.reducer;
