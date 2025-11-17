import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../config/supabase';
import { apiService } from '../../services/api.axios';
import { ENDPOINT } from '../../services/api.endpoint';

// Đăng nhập với Google tokens
export const loginWithGoogleTokens = createAsyncThunk(
  'auth/loginWithGoogleTokens',
  async ({ access_token, refresh_token }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(ENDPOINT.LOGIN_GOOGLE, {
        access_token,
        refresh_token,
      });

      console.log('Login Response:', response);

      if (!response || response.status === false || !response.token) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }

      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      return {
        user: response.user,
        token: response.token,
        isNewUser: response.isNewUser || false,
      };
    } catch (error) {
      console.error('Login Error:', error);
      
      let errorMessage = 'Đăng nhập thất bại';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy session hiện tại
export const getCurrentSession = createAsyncThunk(
  'auth/getCurrentSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session) {
        return {
          user: data.session.user,
          session: data.session,
        };
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Logout user - Không gọi API, chỉ clear local
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Đăng xuất khỏi Supabase
      await supabase.auth.signOut();
      
      // Xóa tất cả dữ liệu trong AsyncStorage
      await AsyncStorage.clear();
      
      console.log('User logged out successfully');
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Ngay cả khi có lỗi, vẫn xóa dữ liệu local
      try {
        await AsyncStorage.clear();
      } catch (clearError) {
        console.error('Clear storage error:', clearError);
      }
      
      return null; // Trả về null thay vì reject để vẫn logout thành công
    }
  }
);

// Thêm thunk mới để check token và lấy thông tin user
export const checkTokenAndGetUser = createAsyncThunk(
  'auth/checkTokenAndGetUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await apiService.get(ENDPOINT.CHECK_TOKEN, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Token Check Response:', response);

      if (!response || response.isLogin !== true) {
        throw new Error(response.message || 'Token invalid');
      }

      return {
        user: response.user,
        isLogin: response.isLogin,
      };
    } catch (error) {
      console.error('Token Check Error:', error);
      
      let errorMessage = 'Failed to check token';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);
