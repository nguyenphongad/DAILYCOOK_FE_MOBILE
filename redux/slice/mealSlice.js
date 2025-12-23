import { createSlice } from '@reduxjs/toolkit';
import { getDietTypes, getMealDetail, getRandomMeals, getMealCategory, getMealCategories, getMealsByCategory } from '../thunk/mealThunk';

const initialState = {
  // Diet types
  dietTypes: [],
  dietTypesLoading: false,
  dietTypesError: null,
  
  // Meal detail
  mealDetail: null,
  mealDetailLoading: false,
  mealDetailError: null,
  
  // Meal categories - lưu theo ID
  mealCategories: {}, // { [categoryId]: categoryData }
  mealCategoryLoading: false,
  mealCategoryError: null,
  
  // Meal categories list
  mealCategoriesList: [],
  mealCategoriesLoading: false,
  mealCategoriesError: null,
  
  // Random meals
  randomMeals: [],
  randomMealsLoading: false,
  randomMealsError: null,
  randomMealsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 20,
  },
  
  // Meals by category
  mealsByCategory: [],
  mealsByCategoryLoading: false,
  mealsByCategoryError: null,
};

const mealSlice = createSlice({
  name: 'meal',
  initialState,
  reducers: {
    clearMealDetail: (state) => {
      state.mealDetail = null;
      state.mealDetailError = null;
    },
    clearRandomMeals: (state) => {
      state.randomMeals = [];
      state.randomMealsError = null;
    },
    clearMealsByCategory: (state) => {
      state.mealsByCategory = [];
      state.mealsByCategoryError = null;
    },
  },
  extraReducers: (builder) => {
    // Get diet types
    builder
      .addCase(getDietTypes.pending, (state) => {
        state.dietTypesLoading = true;
        state.dietTypesError = null;
      })
      .addCase(getDietTypes.fulfilled, (state, action) => {
        state.dietTypesLoading = false;
        state.dietTypes = action.payload.data || [];
      })
      .addCase(getDietTypes.rejected, (state, action) => {
        state.dietTypesLoading = false;
        state.dietTypesError = action.payload;
      });
    
    // Get meal detail
    builder
      .addCase(getMealDetail.pending, (state) => {
        state.mealDetailLoading = true;
        state.mealDetailError = null;
      })
      .addCase(getMealDetail.fulfilled, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetail = action.payload.data || null;
      })
      .addCase(getMealDetail.rejected, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetailError = action.payload;
      });
    
    // Get meal category
    builder
      .addCase(getMealCategory.pending, (state) => {
        state.mealCategoryLoading = true;
        state.mealCategoryError = null;
      })
      .addCase(getMealCategory.fulfilled, (state, action) => {
        state.mealCategoryLoading = false;
        
        // Lưu category vào object theo ID
        const categoryData = action.payload.data;
        if (categoryData && categoryData._id) {
          state.mealCategories[categoryData._id] = categoryData;
        }
      })
      .addCase(getMealCategory.rejected, (state, action) => {
        state.mealCategoryLoading = false;
        state.mealCategoryError = action.payload;
      });
    
    // Get meal categories list
    builder
      .addCase(getMealCategories.pending, (state) => {
        state.mealCategoriesLoading = true;
        state.mealCategoriesError = null;
      })
      .addCase(getMealCategories.fulfilled, (state, action) => {
        state.mealCategoriesLoading = false;
        
        console.log('Meal Categories Response:', action.payload);
        console.log('Meal Categories Data:', action.payload.data);
        
        // Parse response - mealCategories nằm trong data.mealCategories
        const data = action.payload.data;
        if (data && Array.isArray(data.mealCategories)) {
          state.mealCategoriesList = data.mealCategories;
        } else if (Array.isArray(data)) {
          state.mealCategoriesList = data;
        } else {
          state.mealCategoriesList = [];
        }
        
        console.log('Meal Categories List:', state.mealCategoriesList);
      })
      .addCase(getMealCategories.rejected, (state, action) => {
        state.mealCategoriesLoading = false;
        state.mealCategoriesError = action.payload;
        state.mealCategoriesList = [];
      });
    
    // Get random meals
    builder
      .addCase(getRandomMeals.pending, (state) => {
        state.randomMealsLoading = true;
        state.randomMealsError = null;
      })
      .addCase(getRandomMeals.fulfilled, (state, action) => {
        state.randomMealsLoading = false;
        
        console.log('Random Meals Response:', action.payload);
        console.log('Meals data:', action.payload.data);
        
        // Lấy meals từ response - có thể là data.meals hoặc data
        const mealsData = action.payload.data?.meals || action.payload.data || [];
        
        state.randomMeals = mealsData;
        
        // Update pagination nếu có
        if (action.payload.data) {
          state.randomMealsPagination = {
            currentPage: action.payload.data.page || 1,
            totalPages: action.payload.data.totalPages || 1,
            totalItems: action.payload.data.total || 0,
            limit: action.payload.data.limit || 20,
          };
        }
      })
      .addCase(getRandomMeals.rejected, (state, action) => {
        state.randomMealsLoading = false;
        state.randomMealsError = action.payload;
      });
    
    // Get meals by category
    builder
      .addCase(getMealsByCategory.pending, (state) => {
        state.mealsByCategoryLoading = true;
        state.mealsByCategoryError = null;
      })
      .addCase(getMealsByCategory.fulfilled, (state, action) => {
        state.mealsByCategoryLoading = false;
        
        console.log('Meals by Category Response:', action.payload);
        
        const data = action.payload.data;
        if (Array.isArray(data)) {
          state.mealsByCategory = data;
        } else if (data && Array.isArray(data.meals)) {
          state.mealsByCategory = data.meals;
        } else if (data && Array.isArray(data.data)) {
          state.mealsByCategory = data.data;
        } else {
          state.mealsByCategory = [];
        }
      })
      .addCase(getMealsByCategory.rejected, (state, action) => {
        state.mealsByCategoryLoading = false;
        state.mealsByCategoryError = action.payload;
        state.mealsByCategory = [];
      });
  },
});

export const { clearMealDetail, clearRandomMeals, clearMealsByCategory } = mealSlice.actions;
export default mealSlice.reducer;
