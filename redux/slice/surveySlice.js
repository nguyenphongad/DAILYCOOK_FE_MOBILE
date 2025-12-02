import { createSlice } from '@reduxjs/toolkit';
import { checkOnboardingStatus, saveOnboardingData } from '../thunk/surveyThunk';

const initialState = {
  isOnboardingCompleted: null,
  surveyData: null,
  loading: false,
  error: null,
  currentStep: 1,
  maxStep: 5,
  // Thêm state để lưu dữ liệu onboarding
  onboardingData: {
    type: null, // 'personal' hoặc 'family'
    personalInfo: {
      gender: null,
      age: null,
      height: null,
      weight: null
    },
    familyInfo: {
      children: 0,
      teenagers: 0,
      adults: 0,
      elderly: 0
    },
    dietaryPreferences: {
      DietType_id: null
    }
  },
  saveLoading: false,
  saveError: null,
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
    // Thêm actions để lưu dữ liệu onboarding
    setOnboardingType: (state, action) => {
      state.onboardingData.type = action.payload;
    },
    setPersonalInfo: (state, action) => {
      state.onboardingData.personalInfo = {
        ...state.onboardingData.personalInfo,
        ...action.payload
      };
    },
    setFamilyInfo: (state, action) => {
      state.onboardingData.familyInfo = {
        ...state.onboardingData.familyInfo,
        ...action.payload
      };
    },
    setDietaryPreferences: (state, action) => {
      state.onboardingData.dietaryPreferences = {
        ...state.onboardingData.dietaryPreferences,
        ...action.payload
      };
    },
    resetOnboardingData: (state) => {
      state.onboardingData = initialState.onboardingData;
      state.saveError = null;
    },
    clearSaveError: (state) => {
      state.saveError = null;
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
      })
      // Thêm cases cho saveOnboardingData
      .addCase(saveOnboardingData.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(saveOnboardingData.fulfilled, (state, action) => {
        state.saveLoading = false;
        if (action.payload && action.payload.data) {
          state.isOnboardingCompleted = action.payload.data.isOnboardingCompleted;
          state.surveyData = action.payload.data;
        }
      })
      .addCase(saveOnboardingData.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.payload;
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
  resetOnboardingCheck,
  setOnboardingType,
  setPersonalInfo,
  setFamilyInfo,
  setDietaryPreferences,
  resetOnboardingData,
  clearSaveError
} = surveySlice.actions;

export default surveySlice.reducer;
