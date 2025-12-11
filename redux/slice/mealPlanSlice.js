import { createSlice } from '@reduxjs/toolkit';
import { 
  generateAIMealPlan, 
  getMealPlanFromCache, 
  getSimilarMeals, 
  replaceMeal,
  saveMealPlan,
  getMealPlanFromDatabase,
  toggleMealEaten,
  getMealHistory
} from '../thunk/mealPlanThunk';

const initialState = {
  currentMealPlan: null,
  loading: false,
  error: null,
  fromCache: false,
  generatedAt: null,
  similarMeals: [],
  similarMealsLoading: false,
  similarMealsError: null,
  replaceMealLoading: false,
  replaceMealError: null,
  saveMealPlanLoading: false,
  saveMealPlanError: null,
  savedMealPlan: null,
  getMealPlanFromDatabaseLoading: false,
  getMealPlanFromDatabaseError: null,
  databaseMealPlan: null,
  hasSavedMealPlan: false, // Flag để check đã có thực đơn đã lưu chưa
  toggleMealEatenLoading: false,
  toggleMealEatenError: null,

  // Meal history
  mealHistory: null,
  mealHistoryLoading: false,
  mealHistoryError: null,
};

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState,
  reducers: {
    clearMealPlan: (state) => {
      state.currentMealPlan = null;
      state.error = null;
      state.fromCache = false;
      state.generatedAt = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSimilarMeals: (state) => {
      console.log('Clearing similar meals');
      state.similarMeals = [];
      state.similarMealsError = null;
    },
    clearReplaceMealError: (state) => {
      state.replaceMealError = null;
    },
    clearSaveMealPlanError: (state) => {
      state.saveMealPlanError = null;
    },
    clearDatabaseMealPlan: (state) => {
      state.databaseMealPlan = null;
      state.getMealPlanFromDatabaseError = null;
      state.hasSavedMealPlan = false;
    },
    clearToggleMealEatenError: (state) => {
      state.toggleMealEatenError = null;
    },
    clearMealHistory: (state) => {
      state.mealHistory = null;
      state.mealHistoryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get from cache
      .addCase(getMealPlanFromCache.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMealPlanFromCache.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMealPlan = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.generatedAt = new Date().toISOString();
      })
      .addCase(getMealPlanFromCache.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate AI
      .addCase(generateAIMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAIMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMealPlan = action.payload.data;
        state.fromCache = action.payload.fromCache;
        state.generatedAt = new Date().toISOString();
      })
      .addCase(generateAIMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get similar meals
      .addCase(getSimilarMeals.pending, (state) => {
        console.log('getSimilarMeals.pending - Setting loading to true');
        state.similarMealsLoading = true;
        state.similarMealsError = null;
        state.similarMeals = [];
      })
      .addCase(getSimilarMeals.fulfilled, (state, action) => {
        console.log('getSimilarMeals.fulfilled - Full payload:', JSON.stringify(action.payload, null, 2));
        
        state.similarMealsLoading = false;
        
        // Extract similar meals từ response
        let meals = [];
        
        if (action.payload?.data?.similarMeals) {
          meals = action.payload.data.similarMeals;
        } else if (action.payload?.similarMeals) {
          meals = action.payload.similarMeals;
        } else if (Array.isArray(action.payload)) {
          meals = action.payload;
        }
        
        // Ensure it's always an array
        state.similarMeals = Array.isArray(meals) ? meals : [];
        
        console.log('getSimilarMeals.fulfilled - Saved meals count:', state.similarMeals.length);
        console.log('getSimilarMeals.fulfilled - First meal:', state.similarMeals[0]?.nameMeal);
      })
      .addCase(getSimilarMeals.rejected, (state, action) => {
        console.log('getSimilarMeals.rejected - Error:', action.payload);
        state.similarMealsLoading = false;
        state.similarMealsError = action.payload;
        state.similarMeals = [];
      })
      // Replace meal
      .addCase(replaceMeal.pending, (state) => {
        state.replaceMealLoading = true;
        state.replaceMealError = null;
      })
      .addCase(replaceMeal.fulfilled, (state, action) => {
        state.replaceMealLoading = false;
        // Update current meal plan with new meal
        if (action.payload.data?.updatedMealPlan) {
          state.currentMealPlan = action.payload.data.updatedMealPlan;
        }
      })
      .addCase(replaceMeal.rejected, (state, action) => {
        state.replaceMealLoading = false;
        state.replaceMealError = action.payload;
      })
      // Save meal plan
      .addCase(saveMealPlan.pending, (state) => {
        console.log('saveMealPlan.pending');
        state.saveMealPlanLoading = true;
        state.saveMealPlanError = null;
      })
      .addCase(saveMealPlan.fulfilled, (state, action) => {
        console.log('saveMealPlan.fulfilled:', action.payload);
        state.saveMealPlanLoading = false;
        state.savedMealPlan = action.payload.data;
        state.hasSavedMealPlan = true;
      })
      .addCase(saveMealPlan.rejected, (state, action) => {
        console.log('saveMealPlan.rejected:', action.payload);
        state.saveMealPlanLoading = false;
        state.saveMealPlanError = action.payload;
      })
      // Get meal plan from database
      .addCase(getMealPlanFromDatabase.pending, (state) => {
        console.log('getMealPlanFromDatabase.pending');
        state.getMealPlanFromDatabaseLoading = true;
        state.getMealPlanFromDatabaseError = null;
      })
      .addCase(getMealPlanFromDatabase.fulfilled, (state, action) => {
        console.log('getMealPlanFromDatabase.fulfilled:', action.payload);
        state.getMealPlanFromDatabaseLoading = false;
        
        // Check nếu có data
        const hasData = action.payload?.data?.mealPlan && 
                       Array.isArray(action.payload.data.mealPlan) && 
                       action.payload.data.mealPlan.length > 0;
        
        state.databaseMealPlan = action.payload.data;
        state.hasSavedMealPlan = hasData;
      })
      .addCase(getMealPlanFromDatabase.rejected, (state, action) => {
        console.log('getMealPlanFromDatabase.rejected:', action.payload);
        state.getMealPlanFromDatabaseLoading = false;
        state.getMealPlanFromDatabaseError = action.payload;
        state.hasSavedMealPlan = false;
      })
      // Toggle meal eaten
      .addCase(toggleMealEaten.pending, (state) => {
        console.log('toggleMealEaten.pending');
        state.toggleMealEatenLoading = true;
        state.toggleMealEatenError = null;
      })
      .addCase(toggleMealEaten.fulfilled, (state, action) => {
        console.log('toggleMealEaten.fulfilled:', action.payload);
        state.toggleMealEatenLoading = false;
        
        // Update databaseMealPlan nếu có
        if (state.databaseMealPlan?.mealPlan) {
          const { mealId, action: mealAction } = action.payload;
          const isEaten = mealAction === 'eaten';
          
          state.databaseMealPlan.mealPlan = state.databaseMealPlan.mealPlan.map(mealTime => ({
            ...mealTime,
            meals: mealTime.meals.map(meal => 
              meal.mealDetail._id === mealId 
                ? { ...meal, isEaten } 
                : meal
            )
          }));
        }
      })
      .addCase(toggleMealEaten.rejected, (state, action) => {
        console.log('toggleMealEaten.rejected:', action.payload);
        state.toggleMealEatenLoading = false;
        state.toggleMealEatenError = action.payload;
      })
      // Get meal history
      .addCase(getMealHistory.pending, (state) => {
        console.log('getMealHistory.pending');
        state.mealHistoryLoading = true;
        state.mealHistoryError = null;
      })
      .addCase(getMealHistory.fulfilled, (state, action) => {
        console.log('getMealHistory.fulfilled:', action.payload);
        state.mealHistoryLoading = false;
        if (action.payload && action.payload.data) {
          state.mealHistory = action.payload.data;
        }
      })
      .addCase(getMealHistory.rejected, (state, action) => {
        console.log('getMealHistory.rejected:', action.payload);
        state.mealHistoryLoading = false;
        state.mealHistoryError = action.payload;
      });
  },
});

export const { 
  clearMealPlan, 
  clearError, 
  clearSimilarMeals, 
  clearReplaceMealError,
  clearSaveMealPlanError,
  clearDatabaseMealPlan,
  clearToggleMealEatenError,
  clearMealHistory
} = mealPlanSlice.actions;

export default mealPlanSlice.reducer;
