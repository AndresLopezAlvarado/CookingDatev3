import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, isAuthenticated: false },

  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;

      state.accessToken = accessToken;
      state.isAuthenticated = !!accessToken;
    },

    setUser: (state, action) => {
      const { user } = action.payload;

      state.user = user;
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },

    logOut: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setCredentials,
  setUser,
  setOnlineUsers,
  setSocketConnection,
  logOut,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectOnlineUsers = (state) => state.auth.onlineUsers;
