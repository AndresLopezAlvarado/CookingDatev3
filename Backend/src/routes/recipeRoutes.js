import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getRecipe } from "../controllers/recipeController.js";

const router = Router();

router.get("/", authRequired, getRecipe);

export default router;
