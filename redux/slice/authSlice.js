import { createSlice } from '@reduxjs/toolkit';
import { logoutUser, getCurrentSession, loginWithGoogleTokens, checkTokenAndGetUser } from '../thunk/authThunk';

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLogin: null, // Thêm field này
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set auth state
    setAuthState: (state, action) => {
      const { user, session } = action.payload;
      state.user = user;
      state.session = session;
      state.isAuthenticated = !!session;
      state.isLogin = !!session; // Set isLogin
      state.error = null;
    },
    
    // Reset auth state
    resetAuthState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Login with Google Tokens
    builder
      .addCase(loginWithGoogleTokens.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleTokens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isLogin = true; // Set isLogin
        state.user = action.payload.user;
        state.session = { token: action.payload.token };
        state.error = null;
      })
      .addCase(loginWithGoogleTokens.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đăng nhập thất bại';
        state.isAuthenticated = false;
        state.isLogin = false; // Set isLogin
        state.user = null;
        state.session = null;
      });

    // Get Current Session
    builder
      .addCase(getCurrentSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentSession.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.session = action.payload.session;
          state.isAuthenticated = true;
        }
      })
      .addCase(getCurrentSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logoutUser.rejected, (state) => {
        return initialState;
      });

    // Check Token and Get User
    builder
      .addCase(checkTokenAndGetUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkTokenAndGetUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isLogin;
        state.isLogin = action.payload.isLogin; // Set isLogin
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkTokenAndGetUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isLogin = false; // Set isLogin
        state.user = null;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setLoading,
  setAuthState,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectSession = (state) => state.auth.session;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
