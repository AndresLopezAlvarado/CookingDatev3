import axios from "axios";
import { SPOONACULAR_API_KEY } from "../config/config.js";

export const getRecipe = async (req, res) => {
  const { diet, intolerances, excludeIngredients } = req.query;

  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/complexSearch",
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          diet,
          intolerances,
          excludeIngredients,
          maxServings: 2,
          addRecipeInformation: true,
          sort: "random",
          number: 1,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error({
      message: "Something went wrong on getRecipe",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on getRecipe",
      error: error,
    });
  }
};
