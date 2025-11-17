import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

export const checkOnboardingStatus = createAsyncThunk(
  'survey/checkOnboardingStatus',
  async (user_id, { rejectWithValue }) => {
    try {
      console.log('surveyThunk - Calling API with user_id:', user_id);
      
      const response = await apiService.get(ENDPOINT.CHECK_IS_BOARDING, {
        headers: {
          'x-api-key': 'DAILYCOOK6K8P2N9B4T7R1F0E5Z3A9C1V2X6M6K8P2N9B4T7R1F0E5Z3W5G7',
        }
      });
      
      console.log('surveyThunk - API response:', response);
      
      // Vì apiService đã trả về response.data, nên response chính là data
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
