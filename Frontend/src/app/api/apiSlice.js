import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut, setUser } from "../../features/auth/authSlice";
import { createApi } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/api`,
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().auth.accessToken;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.data?.error?.message === "jwt expired") {
    console.log(
      "accessToken expired!, attempting to refresh... (baseQueryWithReauth)"
    );

    const refreshResult = await baseQuery(
      "/auth/refreshToken",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const user = api.getState().auth.user;

      api.dispatch(
        setCredentials({ accessToken: refreshResult.data.accessToken })
      );

      api.dispatch(setUser({ user }));

      console.log("accessToken refreshed successfully! (baseQueryWithReauth)");

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({}),
});
