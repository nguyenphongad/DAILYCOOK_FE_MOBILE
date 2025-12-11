import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

export const getDietTypes = createAsyncThunk(
  'meal/getDietTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.GET_LIST_DIETTYPE);
      
      console.log('API Response - Diet Types:', response);
      
      return response;
    } catch (error) {
      console.error('Get diet types error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách chế độ ăn'
      );
    }
  }
);

export const getMealDetail = createAsyncThunk(
  'meal/getMealDetail',
  async (mealId, { rejectWithValue }) => {
    try {
      console.log('=== GET MEAL DETAIL REQUEST ===');
      console.log('Meal ID:', mealId);
      console.log('===============================');
      
      const response = await apiService.get(ENDPOINT.GET_MEAL_DETAIL(mealId));
      
      console.log('API Response - Meal Detail:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEAL DETAIL ERROR ===');
      console.error('Error:', error);
      console.error('============================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin món ăn'
      );
    }
  }
);
