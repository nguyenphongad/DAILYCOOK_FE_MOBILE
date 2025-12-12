import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

// Get ingredient detail
export const getIngredientDetail = createAsyncThunk(
  'ingredient/getDetail',
  async (ingredientId, { rejectWithValue }) => {
    try {
      console.log('=== GET INGREDIENT DETAIL REQUEST ===');
      console.log('Ingredient ID:', ingredientId);
      console.log('=====================================');
      
      const response = await apiService.get(ENDPOINT.GET_INGREDIENT_DETAIL(ingredientId));
      
      console.log('API Response - Ingredient Detail:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET INGREDIENT DETAIL ERROR ===');
      console.error('Error:', error);
      console.error('===================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin nguyên liệu'
      );
    }
  }
);

// Get measurement units
export const getMeasurementUnits = createAsyncThunk(
  'ingredient/getMeasurementUnits',
  async (_, { rejectWithValue }) => {
    try {
      console.log('=== GET MEASUREMENT UNITS REQUEST ===');
      console.log('Endpoint:', ENDPOINT.GET_MEASUREMENT_UNITS);
      console.log('=====================================');
      
      const response = await apiService.get(ENDPOINT.GET_MEASUREMENT_UNITS);
      
      console.log('API Response - Measurement Units:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEASUREMENT UNITS ERROR ===');
      console.error('Error:', error);
      console.error('===================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách đơn vị đo'
      );
    }
  }
);

// Batch get ingredient details - Lấy nhiều ingredients cùng lúc
export const batchGetIngredientDetails = createAsyncThunk(
  'ingredient/batchGetDetails',
  async (ingredientIds, { dispatch, rejectWithValue }) => {
    try {
      console.log('=== BATCH GET INGREDIENT DETAILS ===');
      console.log('Ingredient IDs:', ingredientIds);
      console.log('====================================');
      
      // Gọi API cho từng ingredient và bắt lỗi riêng biệt
      const results = await Promise.allSettled(
        ingredientIds.map(id => 
          dispatch(getIngredientDetail(id)).unwrap()
        )
      );
      
      // Lọc ra các kết quả thành công
      const successResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      // Log các ingredient bị lỗi
      const failedIds = results
        .map((result, index) => result.status === 'rejected' ? ingredientIds[index] : null)
        .filter(Boolean);
      
      if (failedIds.length > 0) {
        console.warn('⚠️ Failed to load ingredients:', failedIds);
      }
      
      console.log(`✅ Batch get ingredients completed: ${successResults.length}/${ingredientIds.length} successful`);
      
      return successResults;
    } catch (error) {
      console.error('=== BATCH GET INGREDIENTS ERROR ===');
      console.error('Error:', error);
      console.error('===================================');
      
      return rejectWithValue(
        error.message || 'Không thể lấy thông tin các nguyên liệu'
      );
    }
  }
);

// Get random ingredients
export const getRandomIngredients = createAsyncThunk(
  'ingredient/getRandomIngredients',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      console.log('=== GET RANDOM INGREDIENTS REQUEST ===');
      console.log('Page:', page, 'Limit:', limit);
      console.log('======================================');
      
      const response = await apiService.get(
        `${ENDPOINT.GET_RANDOM_INGREDIENTS}?page=${page}&limit=${limit}`
      );
      
      console.log('API Response - Random Ingredients:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET RANDOM INGREDIENTS ERROR ===');
      console.error('Error:', error);
      console.error('====================================');
      
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách nguyên liệu ngẫu nhiên'
      );
    }
  }
);
