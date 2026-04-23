import express from "express";
import {
  getProfile,
  updateProfile,
} from "./../controllers/profileController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-profile", verifyToken, getProfile);
router.put("/update-profile", updateProfile);

export default router;
