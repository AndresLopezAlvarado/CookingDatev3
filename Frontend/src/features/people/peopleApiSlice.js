import { apiSlice } from "../../app/api/apiSlice";

export const peopleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPeople: builder.query({ query: () => "/people", keepUnusedDataFor: 5 }),

    getPerson: builder.query({
      query: ({ userId }) => `/people/${userId}`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetPeopleQuery, useGetPersonQuery } = peopleApiSlice;
