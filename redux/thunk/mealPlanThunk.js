import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

// Get meal plan from cache
export const getMealPlanFromCache = createAsyncThunk(
  'mealPlan/getFromCache',
  async (date = null, { rejectWithValue }) => {
    try {
      const requestDate = date || new Date().toISOString().split('T')[0];
      const requestData = { date: requestDate };
      
      console.log('=== GET MEAL PLAN FROM CACHE REQUEST ===');
      console.log('Endpoint:', ENDPOINT.GET_MEAL_PLAN_FROM_CACHE);
      console.log('Request data:', requestData);
      console.log('========================================');
      
      const response = await apiService.post(
        ENDPOINT.GET_MEAL_PLAN_FROM_CACHE, 
        requestData
      );
      
      console.log('API Response - Get From Cache:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET FROM CACHE ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('============================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể lấy thực đơn từ cache'
      );
    }
  }
);

export const generateAIMealPlan = createAsyncThunk(
  'mealPlan/generateAI',
  async (date = null, { rejectWithValue }) => {
    try {
      const requestDate = date || new Date().toISOString().split('T')[0];
      const requestData = { date: requestDate };
      
      console.log('=== GENERATE AI MEAL PLAN REQUEST ===');
      console.log('Endpoint:', ENDPOINT.GENERATE_AI_MEAL_PLAN);
      console.log('Request data:', requestData);
      console.log('=====================================');
      
      const response = await apiService.post(
        ENDPOINT.GENERATE_AI_MEAL_PLAN, 
        requestData
      );
      
      console.log('API Response - Generate AI Meal Plan:', response);
      
      return response;
    } catch (error) {
      console.error('=== GENERATE AI MEAL PLAN ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('===================================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể tạo thực đơn AI'
      );
    }
  }
);

// Get similar meals
export const getSimilarMeals = createAsyncThunk(
  'mealPlan/getSimilarMeals',
  async (mealId, { rejectWithValue }) => {
    try {
      console.log('=== GET SIMILAR MEALS REQUEST ===');
      console.log('Meal ID:', mealId);
      console.log('=================================');
      
      const response = await apiService.get(ENDPOINT.GET_SIMILAR_MEALS(mealId));
      
      console.log('API Response - Get Similar Meals:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET SIMILAR MEALS ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('================================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể lấy món tương tự'
      );
    }
  }
);

// Replace meal
export const replaceMeal = createAsyncThunk(
  'mealPlan/replaceMeal',
  async ({ date, servingTime, oldMealId, newMealId, portionSize }, { rejectWithValue }) => {
    try {
      const requestData = {
        date,
        servingTime,
        oldMealId,
        newMealId,
        portionSize
      };
      
      console.log('=== REPLACE MEAL REQUEST ===');
      console.log('Request data:', requestData);
      console.log('============================');
      
      const response = await apiService.put(ENDPOINT.REPLACE_MEAL, requestData);
      
      console.log('API Response - Replace Meal:', response);
      
      return response;
    } catch (error) {
      console.error('=== REPLACE MEAL ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('==========================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể đổi món'
      );
    }
  }
);

// Save meal plan
export const saveMealPlan = createAsyncThunk(
  'mealPlan/save',
  async (date = null, { rejectWithValue }) => {
    try {
      const requestDate = date || new Date().toISOString().split('T')[0];
      const requestData = { date: requestDate };
      
      console.log('=== SAVE MEAL PLAN REQUEST ===');
      console.log('Request data:', requestData);
      console.log('==============================');
      
      const response = await apiService.post(ENDPOINT.SAVE_MEAL_PLAN, requestData);
      
      console.log('API Response - Save Meal Plan:', response);
      
      return response;
    } catch (error) {
      console.error('=== SAVE MEAL PLAN ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('============================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể lưu thực đơn'
      );
    }
  }
);

// Get meal plan from database
export const getMealPlanFromDatabase = createAsyncThunk(
  'mealPlan/getFromDatabase',
  async (date = null, { rejectWithValue }) => {
    try {
      const requestDate = date || new Date().toISOString().split('T')[0];
      const requestData = { date: requestDate };
      
      console.log('=== GET MEAL PLAN FROM DATABASE REQUEST ===');
      console.log('Request data:', requestData);
      console.log('===========================================');
      
      const response = await apiService.post(
        ENDPOINT.GET_MEAL_PLAN_FROM_DATABASE, 
        requestData
      );
      
      console.log('API Response - Get From Database:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET FROM DATABASE ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('===============================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể lấy thực đơn từ database'
      );
    }
  }
);

// Toggle meal eaten status
export const toggleMealEaten = createAsyncThunk(
  'mealPlan/toggleEaten',
  async ({ date, servingTime, mealId, action }, { rejectWithValue }) => {
    try {
      const requestData = {
        date,
        servingTime,
        mealId,
        action // 'eaten' hoặc 'uneaten'
      };
      
      console.log('=== TOGGLE MEAL EATEN REQUEST ===');
      console.log('Request data:', requestData);
      console.log('=================================');
      
      const response = await apiService.post(ENDPOINT.TOGGLE_MEAL_EATEN, requestData);
      
      console.log('API Response - Toggle Meal Eaten:', response);
      
      return { ...response, mealId, action };
    } catch (error) {
      console.error('=== TOGGLE MEAL EATEN ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('================================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể ghi nhận món ăn'
      );
    }
  }
);

// Get meal history
export const getMealHistory = createAsyncThunk(
  'mealPlan/getMealHistory',
  async (date, { rejectWithValue }) => {
    try {
      // Format date to YYYY-MM-DD nếu là Date object
      let dateString = date;
      if (date instanceof Date) {
        dateString = date.toISOString().split('T')[0];
      }
      
      console.log('=== GET MEAL HISTORY REQUEST ===');
      console.log('Date:', dateString);
      console.log('=================================');
      
      const response = await apiService.get(ENDPOINT.GET_MEAL_HISTORY(dateString));
      
      console.log('API Response - Get Meal History:', response);
      
      return response;
    } catch (error) {
      console.error('=== GET MEAL HISTORY ERROR ===');
      console.error('Error type:', error.constructor?.name);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('================================');
      
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Không thể lấy lịch sử ăn uống'
      );
    }
  }
);
