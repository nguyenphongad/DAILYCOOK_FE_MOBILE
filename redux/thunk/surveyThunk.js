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

export const completeOnboarding = createAsyncThunk(
  'survey/completeOnboarding',
  async (onboardingData, { rejectWithValue }) => {
    try {
      // Tạm thời chỉ return success, sau này sẽ implement API call thực
      console.log('Completing onboarding with data:', onboardingData);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
