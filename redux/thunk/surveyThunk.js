import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

export const checkOnboardingStatus = createAsyncThunk(
  'survey/checkOnboardingStatus',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.CHECK_IS_BOARDING);
      
      console.log('API Response - Onboarding Status:', response);
      
      return response;
    } catch (error) {
      console.error('Check onboarding status error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể kiểm tra trạng thái onboarding'
      );
    }
  }
);

export const saveOnboardingData = createAsyncThunk(
  'survey/saveOnboardingData',
  async ({ type, data }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINT.SAVE_ONBOARDING_DATA, {
        type,
        data
      });
      
      console.log('API Response - Save Onboarding:', response);
      
      return response;
    } catch (error) {
      console.error('Save onboarding data error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lưu dữ liệu onboarding'
      );
    }
  }
);
