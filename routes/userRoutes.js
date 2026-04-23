import express from "express";
import { getUser, updateUser, updatePreferences } from "../controllers/userController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getUser);
router.put("/", verifyToken, updateUser);
router.put("/preferences", verifyToken, updatePreferences);

export default router;