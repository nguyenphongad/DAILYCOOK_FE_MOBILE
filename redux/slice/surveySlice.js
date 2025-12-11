import { createSlice } from '@reduxjs/toolkit';
import { 
  checkOnboardingStatus, 
  saveOnboardingData,
  getSurveyQuestions,
  getSurveyResponses,
  saveSurveyResponses,
  updateSurveyResponses,
  updateDietaryPreferences,
  getDietaryPreferences,
  calculateNutritionGoals,
  getNutritionGoals
} from '../thunk/surveyThunk';

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
  // Thêm state cho dietary preferences
  currentDietaryPreferences: null,
  dietaryPreferencesLoading: false,
  dietaryPreferencesError: null,
  updateDietaryPreferencesLoading: false,
  updateDietaryPreferencesError: null,
  // Nutrition goals
  nutritionGoals: null,
  nutritionGoalsLoading: false,
  nutritionGoalsError: null,
  // State cho câu hỏi khảo sát
  surveyQuestions: [],
  surveyQuestionsLoading: false,
  surveyQuestionsError: null,
  // State cho câu trả lời khảo sát
  surveyResponses: null,
  surveyResponsesLoading: false,
  surveyResponsesError: null,
  saveSurveyResponsesLoading: false,
  saveSurveyResponsesError: null,
  updateSurveyResponsesLoading: false,
  updateSurveyResponsesError: null,
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
    // Thêm actions cho dietary preferences
    clearDietaryPreferencesError: (state) => {
      state.dietaryPreferencesError = null;
      state.updateDietaryPreferencesError = null;
    },
    resetDietaryPreferences: (state) => {
      state.currentDietaryPreferences = null;
      state.dietaryPreferencesError = null;
      state.updateDietaryPreferencesError = null;
    },
    // Actions cho nutrition goals
    clearNutritionGoalsError: (state) => {
      state.nutritionGoalsError = null;
    },
    resetNutritionGoals: (state) => {
      state.nutritionGoals = null;
      state.nutritionGoalsError = null;
    },
    // Actions cho survey responses
    clearSurveyResponsesError: (state) => {
      state.surveyResponsesError = null;
      state.saveSurveyResponsesError = null;
      state.updateSurveyResponsesError = null;
    },
    resetSurveyResponses: (state) => {
      state.surveyResponses = null;
      state.surveyResponsesError = null;
      state.saveSurveyResponsesError = null;
      state.updateSurveyResponsesError = null;
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
      })
      // Cases cho getDietaryPreferences
      .addCase(getDietaryPreferences.pending, (state) => {
        state.dietaryPreferencesLoading = true;
        state.dietaryPreferencesError = null;
      })
      .addCase(getDietaryPreferences.fulfilled, (state, action) => {
        state.dietaryPreferencesLoading = false;
        if (action.payload && action.payload.data && action.payload.data.dietaryPreferences) {
          state.currentDietaryPreferences = action.payload.data.dietaryPreferences;
        }
      })
      .addCase(getDietaryPreferences.rejected, (state, action) => {
        state.dietaryPreferencesLoading = false;
        state.dietaryPreferencesError = action.payload;
      })
      
      // Cases cho updateDietaryPreferences
      .addCase(updateDietaryPreferences.pending, (state) => {
        state.updateDietaryPreferencesLoading = true;
        state.updateDietaryPreferencesError = null;
      })
      .addCase(updateDietaryPreferences.fulfilled, (state, action) => {
        state.updateDietaryPreferencesLoading = false;
        if (action.payload && action.payload.data && action.payload.data.dietaryPreferences) {
          state.currentDietaryPreferences = action.payload.data.dietaryPreferences;
        }
      })
      .addCase(updateDietaryPreferences.rejected, (state, action) => {
        state.updateDietaryPreferencesLoading = false;
        state.updateDietaryPreferencesError = action.payload;
      })
      // Cases cho calculateNutritionGoals
      .addCase(calculateNutritionGoals.pending, (state) => {
        state.nutritionGoalsLoading = true;
        state.nutritionGoalsError = null;
      })
      .addCase(calculateNutritionGoals.fulfilled, (state, action) => {
        state.nutritionGoalsLoading = false;
        if (action.payload && action.payload.data) {
          state.nutritionGoals = action.payload.data;
        }
      })
      .addCase(calculateNutritionGoals.rejected, (state, action) => {
        state.nutritionGoalsLoading = false;
        state.nutritionGoalsError = action.payload;
      })
      
      // Cases cho getNutritionGoals
      .addCase(getNutritionGoals.pending, (state) => {
        state.nutritionGoalsLoading = true;
        state.nutritionGoalsError = null;
      })
      .addCase(getNutritionGoals.fulfilled, (state, action) => {
        state.nutritionGoalsLoading = false;
        if (action.payload && action.payload.data) {
          state.nutritionGoals = action.payload.data;
        }
      })
      .addCase(getNutritionGoals.rejected, (state, action) => {
        state.nutritionGoalsLoading = false;
        state.nutritionGoalsError = action.payload;
      })
      // Get survey questions
      .addCase(getSurveyQuestions.pending, (state) => {
        state.surveyQuestionsLoading = true;
        state.surveyQuestionsError = null;
      })
      .addCase(getSurveyQuestions.fulfilled, (state, action) => {
        state.surveyQuestionsLoading = false;
        if (action.payload && action.payload.data) {
          state.surveyQuestions = action.payload.data;
        } else {
          state.surveyQuestions = [];
        }
      })
      .addCase(getSurveyQuestions.rejected, (state, action) => {
        state.surveyQuestionsLoading = false;
        state.surveyQuestionsError = action.payload;
        state.surveyQuestions = [];
      })
      
      // Get survey responses
      .addCase(getSurveyResponses.pending, (state) => {
        state.surveyResponsesLoading = true;
        state.surveyResponsesError = null;
      })
      .addCase(getSurveyResponses.fulfilled, (state, action) => {
        state.surveyResponsesLoading = false;
        if (action.payload && action.payload.data) {
          state.surveyResponses = action.payload.data;
        }
      })
      .addCase(getSurveyResponses.rejected, (state, action) => {
        state.surveyResponsesLoading = false;
        state.surveyResponsesError = action.payload;
      })
      
      // Save survey responses
      .addCase(saveSurveyResponses.pending, (state) => {
        state.saveSurveyResponsesLoading = true;
        state.saveSurveyResponsesError = null;
      })
      .addCase(saveSurveyResponses.fulfilled, (state, action) => {
        state.saveSurveyResponsesLoading = false;
        if (action.payload && action.payload.data) {
          state.surveyResponses = action.payload.data;
        }
      })
      .addCase(saveSurveyResponses.rejected, (state, action) => {
        state.saveSurveyResponsesLoading = false;
        state.saveSurveyResponsesError = action.payload;
      })
      
      // Update survey responses
      .addCase(updateSurveyResponses.pending, (state) => {
        state.updateSurveyResponsesLoading = true;
        state.updateSurveyResponsesError = null;
      })
      .addCase(updateSurveyResponses.fulfilled, (state, action) => {
        state.updateSurveyResponsesLoading = false;
        if (action.payload && action.payload.data) {
          state.surveyResponses = action.payload.data;
        }
      })
      .addCase(updateSurveyResponses.rejected, (state, action) => {
        state.updateSurveyResponsesLoading = false;
        state.updateSurveyResponsesError = action.payload;
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
  clearSaveError,
  clearDietaryPreferencesError,
  resetDietaryPreferences,
  clearNutritionGoalsError,
  resetNutritionGoals,
  clearSurveyResponsesError,
  resetSurveyResponses
} = surveySlice.actions;

export default surveySlice.reducer;
