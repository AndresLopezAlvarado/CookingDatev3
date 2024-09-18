import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getPeople, getPerson } from "../controllers/peopleController.js";

const router = Router();

router.get("/", authRequired, getPeople);
router.get("/:id", authRequired, getPerson);

export default router;
