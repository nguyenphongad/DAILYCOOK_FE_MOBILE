import { createSlice } from '@reduxjs/toolkit';
import { getDietTypes, getMealDetail, getRandomMeals } from '../thunk/mealThunk';

const initialState = {
  dietTypes: [],
  loading: false,
  error: null,
  
  // Meal detail state
  mealDetail: null,
  mealDetailLoading: false,
  mealDetailError: null,
  
  // Random meals state
  randomMeals: [],
  randomMealsLoading: false,
  randomMealsError: null,
  randomMealsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalMeals: 0,
  },
};

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetMealState: (state) => {
      state.dietTypes = [];
      state.loading = false;
      state.error = null;
    },
    clearMealDetail: (state) => {
      state.mealDetail = null;
      state.mealDetailError = null;
    },
    clearRandomMeals: (state) => {
      state.randomMeals = [];
      state.randomMealsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDietTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDietTypes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.data && action.payload.data.dietTypes) {
          // Sắp xếp theo _id hoặc createdAt giảm dần (mới nhất trước)
          state.dietTypes = action.payload.data.dietTypes.sort((a, b) => {
            // Nếu có createdAt
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            // Hoặc sắp xếp theo _id (giả sử _id lớn hơn = tạo sau)
            return b._id.localeCompare(a._id);
          });
        }
      })
      .addCase(getDietTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get meal detail
      .addCase(getMealDetail.pending, (state) => {
        state.mealDetailLoading = true;
        state.mealDetailError = null;
      })
      .addCase(getMealDetail.fulfilled, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetail = action.payload.data;
      })
      .addCase(getMealDetail.rejected, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetailError = action.payload;
      })
      // Get random meals
      .addCase(getRandomMeals.pending, (state) => {
        state.randomMealsLoading = true;
        state.randomMealsError = null;
      })
      .addCase(getRandomMeals.fulfilled, (state, action) => {
        state.randomMealsLoading = false;
        if (action.payload && action.payload.data) {
          state.randomMeals = action.payload.data.meals || [];
          state.randomMealsPagination = {
            currentPage: action.payload.data.currentPage || 1,
            totalPages: action.payload.data.totalPages || 1,
            totalMeals: action.payload.data.totalMeals || 0,
          };
        }
      })
      .addCase(getRandomMeals.rejected, (state, action) => {
        state.randomMealsLoading = false;
        state.randomMealsError = action.payload;
      });
  },
});

export const { 
  clearError,
  resetMealState,
  clearMealDetail,
  clearRandomMeals 
} = mealSlice.actions;

export default mealSlice.reducer;
