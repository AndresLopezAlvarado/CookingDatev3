import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";
import authReducer from "../features/auth/authSlice";
import { apiSlice } from "./api/apiSlice";

const persistConfig = {
  key: "auth",
  storage: sessionStorage,
  whitelist: ["user", "isAuthenticated", "accessToken"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware
    ),

  devTools: true,
});

export const persistor = persistStore(store);
