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

// Lấy thông tin dietary preferences của user
export const getDietaryPreferences = createAsyncThunk(
  'survey/getDietaryPreferences',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.GET_DIETARY_PREFERENCES(userId));
      
      console.log('API Response - Get Dietary Preferences:', response);
      
      return response;
    } catch (error) {
      console.error('Get dietary preferences error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy thông tin chế độ ăn'
      );
    }
  }
);

// Cập nhật dietary preferences của user
export const updateDietaryPreferences = createAsyncThunk(
  'survey/updateDietaryPreferences',
  async ({ userId, dietTypeId }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(ENDPOINT.UPDATE_DIETARY_PREFERENCES(userId), {
        DietType_id: dietTypeId
      });
      
      console.log('API Response - Update Dietary Preferences:', response);
      
      return response;
    } catch (error) {
      console.error('Update dietary preferences error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật chế độ ăn'
      );
    }
  }
);

// Tính toán mục tiêu dinh dưỡng
export const calculateNutritionGoals = createAsyncThunk(
  'survey/calculateNutritionGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINT.CALCULATE_NUTRITION_GOALS);
      
      console.log('API Response - Calculate Nutrition Goals:', response);
      
      return response;
    } catch (error) {
      console.error('Calculate nutrition goals error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tính toán mục tiêu dinh dưỡng'
      );
    }
  }
);

// Lấy mục tiêu dinh dưỡng đã lưu
export const getNutritionGoals = createAsyncThunk(
  'survey/getNutritionGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.GET_NUTRITION_GOALS);
      
      console.log('API Response - Get Nutrition Goals:', response);
      
      return response;
    } catch (error) {
      console.error('Get nutrition goals error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy mục tiêu dinh dưỡng'
      );
    }
  }
);

// Lấy danh sách câu hỏi khảo sát
export const getSurveyQuestions = createAsyncThunk(
  'survey/getSurveyQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.GET_SURVEY_QUESTIONS);
      
      console.log('API Response - Get Survey Questions:', response);
      
      return response;
    } catch (error) {
      console.error('Get survey questions error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy danh sách câu hỏi khảo sát'
      );
    }
  }
);

// Lấy câu trả lời khảo sát đã lưu
export const getSurveyResponses = createAsyncThunk(
  'survey/getSurveyResponses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(ENDPOINT.GET_SURVEY_RESPONSES);
      
      console.log('API Response - Get Survey Responses:', response);
      
      return response;
    } catch (error) {
      console.error('Get survey responses error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lấy câu trả lời khảo sát'
      );
    }
  }
);

// Lưu câu trả lời khảo sát
export const saveSurveyResponses = createAsyncThunk(
  'survey/saveSurveyResponses',
  async (responses, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINT.SAVE_SURVEY_RESPONSES, responses);
      
      console.log('API Response - Save Survey Responses:', response);
      
      return response;
    } catch (error) {
      console.error('Save survey responses error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể lưu câu trả lời khảo sát'
      );
    }
  }
);

// Cập nhật câu trả lời khảo sát
export const updateSurveyResponses = createAsyncThunk(
  'survey/updateSurveyResponses',
  async ({ responseId, responses }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(
        ENDPOINT.UPDATE_SURVEY_RESPONSES(responseId),
        responses
      );
      
      console.log('API Response - Update Survey Responses:', response);
      
      return response;
    } catch (error) {
      console.error('Update survey responses error:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật câu trả lời khảo sát'
      );
    }
  }
);
