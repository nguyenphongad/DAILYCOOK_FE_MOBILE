import { createSlice } from '@reduxjs/toolkit';
import { getRecipeDetail } from '../thunk/recipeThunk';

const initialState = {
  recipeDetail: null,
  recipeDetailLoading: false,
  recipeDetailError: null,
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    clearRecipeDetail: (state) => {
      state.recipeDetail = null;
      state.recipeDetailError = null;
    },
  },
  extraReducers: (builder) => {
    // Get recipe detail
    builder
      .addCase(getRecipeDetail.pending, (state) => {
        state.recipeDetailLoading = true;
        state.recipeDetailError = null;
      })
      .addCase(getRecipeDetail.fulfilled, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetail = action.payload.data;
      })
      .addCase(getRecipeDetail.rejected, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetailError = action.payload;
      });
  },
});

export const { clearRecipeDetail } = recipeSlice.actions;
export default recipeSlice.reducer;
