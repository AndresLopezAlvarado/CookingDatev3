import { apiSlice } from "../../app/api/apiSlice";

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipe: builder.query({
      query: ({ diet, intolerances, excludeIngredients }) => ({
        url: "/recipe",
        params: { diet, intolerances, excludeIngredients },
      }),
    }),
  }),
});

export const { useLazyGetRecipeQuery } = recipeApiSlice;
