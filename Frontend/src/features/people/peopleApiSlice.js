import { apiSlice } from "../../app/api/apiSlice";

export const peopleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPeople: builder.query({
      query: ({ userId }) => `/people?userId=${userId}`,
      keepUnusedDataFor: 5,
    }),

    getPerson: builder.query({
      query: ({ userId }) => `/people/${userId}`,
      keepUnusedDataFor: 5,
    }),

    getFavorites: builder.query({
      query: ({ userId }) => `/people/favorites?userId=${userId}`,
      keepUnusedDataFor: 5,
    }),

    reportPerson: builder.mutation({
      query: (report) => ({
        url: "/people/reportPerson",
        method: "POST",
        body: { ...report },
      }),
    }),
  }),
});

export const {
  useGetPeopleQuery,
  useGetPersonQuery,
  useGetFavoritesQuery,
  useReportPersonMutation,
} = peopleApiSlice;
