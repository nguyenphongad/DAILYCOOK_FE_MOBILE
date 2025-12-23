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

export const getRandomMeals = createAsyncThunk(
  'meal/getRandomMeals',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      console.log('=== GET RANDOM MEALS REQUEST ===');
      console.log('Page:', page, 'Limit:', limit);
      console.log('Endpoint:', `${ENDPOINT.GET_RANDOM_MEALS}?page=${page}&limit=${limit}`);
      console.log('================================');
      
      const response = await apiService.get(
        `${ENDPOINT.GET_RANDOM_MEALS}?page=${page}&limit=${limit}`
      );
      
      console.log('API Response - Full:', response);
      console.log('API Response - Data:', response.data);
      console.log('API Response - Data.meals:', response.data?.meals);
      
      // Log từng meal để xem cấu trúc
      if (response.data?.meals && response.data.meals.length > 0) {
        console.log('First meal structure:', response.data.meals[0]);
      }
      
      return response;
    } catch (error) {
      console.error('=== GET RANDOM MEALS ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('==============================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách món ăn'
      );
    }
  }
);

export const getMealCategory = createAsyncThunk(
  'meal/getMealCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      console.log('=== GET MEAL CATEGORY REQUEST ===');
      console.log('Category ID:', categoryId);
      console.log('=================================');
      
      const response = await apiService.get(ENDPOINT.GET_MEAL_CATEGORY(categoryId));
      
      console.log('API Response - Meal Category:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEAL CATEGORY ERROR ===');
      console.error('Error:', error);
      console.error('===============================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin danh mục món ăn'
      );
    }
  }
);

export const getMealCategories = createAsyncThunk(
  'meal/getMealCategories',
  async ({ page = 1, limit = 30 } = {}, { rejectWithValue }) => {
    try {
      console.log('=== GET MEAL CATEGORIES REQUEST ===');
      console.log('Page:', page, 'Limit:', limit);
      console.log('===================================');
      
      const response = await apiService.get(
        `${ENDPOINT.GET_MEAL_CATEGORIES}?page=${page}&limit=${limit}`
      );
      
      console.log('API Response - Meal Categories:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEAL CATEGORIES ERROR ===');
      console.error('Error:', error);
      console.error('=================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách danh mục món ăn'
      );
    }
  }
);

export const getMealsByCategory = createAsyncThunk(
  'meal/getMealsByCategory',
  async ({ categoryId, page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      console.log('=== GET MEALS BY CATEGORY REQUEST ===');
      console.log('Category ID:', categoryId, 'Page:', page, 'Limit:', limit);
      console.log('=====================================');
      
      const response = await apiService.get(
        `${ENDPOINT.GET_MEALS_BY_CATEGORY(categoryId)}?page=${page}&limit=${limit}`
      );
      
      console.log('API Response - Meals by Category:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEALS BY CATEGORY ERROR ===');
      console.error('Error:', error);
      console.error('===================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách món ăn theo danh mục'
      );
    }
  }
);
