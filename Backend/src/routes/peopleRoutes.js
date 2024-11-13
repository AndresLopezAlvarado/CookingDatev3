import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getPeople,
  getPerson,
  getFavorites,
  reportPerson,
} from "../controllers/peopleController.js";

const router = Router();

router.get("/favorites", authRequired, getFavorites);
router.post("/reportPerson", authRequired, reportPerson);
router.get("/", authRequired, getPeople);
router.get("/:id", authRequired, getPerson);

export default router;
