import express from "express";
import {
  registerUser,
  generateNewOtp,
  verifyOtpLogin,
  changePassword,
  verifyPassword,
} from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login/register", registerUser);
router.post("/login/generateOTP", generateNewOtp);
router.post("/login/verifyOTP", verifyOtpLogin);

router.post("/password/change-password", authenticateJWT, changePassword);
router.post("/password/verify-password", verifyPassword);

export default router;
