import { createSlice } from '@reduxjs/toolkit';
import { getIngredientDetail, getMeasurementUnits, batchGetIngredientDetails } from '../thunk/ingredientThunk';

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
  },
});

export const { clearIngredientDetails, clearSingleIngredient } = ingredientSlice.actions;
export default ingredientSlice.reducer;
