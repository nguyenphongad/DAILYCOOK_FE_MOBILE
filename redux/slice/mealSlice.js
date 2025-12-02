import { createSlice } from '@reduxjs/toolkit';
import { getDietTypes } from '../thunk/MealThunk';

const initialState = {
  dietTypes: [],
  loading: false,
  error: null,
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
      });
  },
});

export const { 
  clearError,
  resetMealState
} = mealSlice.actions;

export default mealSlice.reducer;
