import express from "express";
import { register, login, getMe, refreshToken, logout } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);

export default router;