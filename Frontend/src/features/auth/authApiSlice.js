import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials, setUser } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (credentials) => ({
        url: "auth/signUp",
        method: "POST",
        body: { ...credentials },
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials({ accessToken: data.accessToken }));
          dispatch(setUser({ user: data.user }));
        } catch (error) {
          console.log({ "Error en onQueryStarted-signUp-authApiSlice": error });
        }
      },
    }),

    signIn: builder.mutation({
      query: (credentials) => ({
        url: "auth/signIn",
        method: "POST",
        body: { ...credentials },
      }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          dispatch(setCredentials({ accessToken: data.accessToken }));
          dispatch(setUser({ user: data.user }));
        } catch (error) {
          console.log({ "Error en onQueryStarted-signIn-authApiSlice": error });
        }
      },
    }),

    logOut: builder.mutation({
      query: () => ({ url: "auth/logOut", method: "POST" }),

      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(logOut());
        } catch (error) {
          console.log({ "Error en authApiSlice-logOut-onQueryStarted": error });
        }
      },
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation, useLogOutMutation } =
  authApiSlice;
