import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { signUpSchema, signInSchema } from "../schemas/authSchema.js";
import {
  signUp,
  signIn,
  logOut,
  refreshToken,
} from "../controllers/authController.js";

const router = Router();

router.post("/signUp", validateSchema(signUpSchema), signUp);
router.post("/signIn", validateSchema(signInSchema), signIn);
router.post("/logOut", logOut);
router.get("/refreshToken", refreshToken);

export default router;
