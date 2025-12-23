import { createSlice } from '@reduxjs/toolkit';
import { 
  getIngredientDetail, 
  getMeasurementUnits, 
  batchGetIngredientDetails,
  getRandomIngredients,
  getIngredientCategoryDetail
} from '../thunk/ingredientThunk';

const initialState = {
  // Ingredient details - lưu theo ID để dễ truy xuất
  ingredientDetails: {}, // { [ingredientId]: ingredientData }
  ingredientDetailLoading: false,
  ingredientDetailError: null,
  
  // Measurement units
  measurementUnits: [],
  measurementUnitsLoading: false,
  measurementUnitsError: null,
  
  // Batch loading state
  batchLoadingIds: [], // Array of ingredient IDs đang được load

  // Random ingredients
  randomIngredients: [],
  randomIngredientsLoading: false,
  randomIngredientsError: null,
  randomIngredientsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },

  // Ingredient category details
  ingredientCategoryDetails: {}, // { [categoryId]: categoryData }
  ingredientCategoryLoading: false,
  ingredientCategoryError: null,
};

const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    clearIngredientDetails: (state) => {
      state.ingredientDetails = {};
      state.ingredientDetailError = null;
    },
    clearSingleIngredient: (state, action) => {
      const ingredientId = action.payload;
      delete state.ingredientDetails[ingredientId];
    },
    clearRandomIngredients: (state) => {
      state.randomIngredients = [];
      state.randomIngredientsError = null;
    },
    clearIngredientCategoryDetails: (state) => {
      state.ingredientCategoryDetails = {};
      state.ingredientCategoryError = null;
    },
  },
  extraReducers: (builder) => {
    // Get ingredient detail
    builder
      .addCase(getIngredientDetail.pending, (state) => {
        state.ingredientDetailLoading = true;
        state.ingredientDetailError = null;
      })
      .addCase(getIngredientDetail.fulfilled, (state, action) => {
        state.ingredientDetailLoading = false;
        
        // Lưu ingredient detail vào object theo ID
        const ingredientData = action.payload.data;
        if (ingredientData && ingredientData._id) {
          state.ingredientDetails[ingredientData._id] = ingredientData;
        }
      })
      .addCase(getIngredientDetail.rejected, (state, action) => {
        state.ingredientDetailLoading = false;
        state.ingredientDetailError = action.payload;
      });
    
    // Get measurement units
    builder
      .addCase(getMeasurementUnits.pending, (state) => {
        state.measurementUnitsLoading = true;
        state.measurementUnitsError = null;
      })
      .addCase(getMeasurementUnits.fulfilled, (state, action) => {
        state.measurementUnitsLoading = false;
        state.measurementUnits = action.payload.data || [];
      })
      .addCase(getMeasurementUnits.rejected, (state, action) => {
        state.measurementUnitsLoading = false;
        state.measurementUnitsError = action.payload;
      });
    
    // Batch get ingredient details
    builder
      .addCase(batchGetIngredientDetails.pending, (state, action) => {
        state.batchLoadingIds = action.meta.arg; // Store IDs being loaded
      })
      .addCase(batchGetIngredientDetails.fulfilled, (state) => {
        state.batchLoadingIds = [];
      })
      .addCase(batchGetIngredientDetails.rejected, (state) => {
        state.batchLoadingIds = [];
      });
    
    // Get random ingredients
    builder
      .addCase(getRandomIngredients.pending, (state) => {
        state.randomIngredientsLoading = true;
        state.randomIngredientsError = null;
      })
      .addCase(getRandomIngredients.fulfilled, (state, action) => {
        state.randomIngredientsLoading = false;
        // Fix: lấy từ data.ingredients thay vì data
        state.randomIngredients = action.payload.data?.ingredients || [];
        
        // Update pagination
        if (action.payload.data) {
          state.randomIngredientsPagination = {
            currentPage: action.payload.data.page || 1,
            totalPages: action.payload.data.totalPages || 1,
            totalItems: action.payload.data.total || 0,
            limit: action.payload.data.limit || 10,
          };
        }
      })
      .addCase(getRandomIngredients.rejected, (state, action) => {
        state.randomIngredientsLoading = false;
        state.randomIngredientsError = action.payload;
      });
    
    // Get ingredient category detail
    builder
      .addCase(getIngredientCategoryDetail.pending, (state) => {
        state.ingredientCategoryLoading = true;
        state.ingredientCategoryError = null;
      })
      .addCase(getIngredientCategoryDetail.fulfilled, (state, action) => {
        state.ingredientCategoryLoading = false;
        const { categoryId, data } = action.payload;
        state.ingredientCategoryDetails[categoryId] = data.data || {};
      })
      .addCase(getIngredientCategoryDetail.rejected, (state, action) => {
        state.ingredientCategoryLoading = false;
        state.ingredientCategoryError = action.payload;
      });
  },
});

export const { 
  clearIngredientDetails, 
  clearSingleIngredient,
  clearRandomIngredients,
  clearIngredientCategoryDetails
} = ingredientSlice.actions;

export default ingredientSlice.reducer;
