import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

// Get recipe detail
export const getRecipeDetail = createAsyncThunk(
  'recipe/getDetail',
  async (recipeId, { rejectWithValue }) => {
    try {
      console.log('=== GET RECIPE DETAIL REQUEST ===');
      console.log('Recipe ID:', recipeId);
      console.log('=================================');
      
      const response = await apiService.get(ENDPOINT.GET_RECIPE_DETAIL(recipeId));
      
      console.log('API Response - Recipe Detail:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET RECIPE DETAIL ERROR ===');
      console.error('Error:', error);
      console.error('================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin công thức'
      );
    }
  }
);
