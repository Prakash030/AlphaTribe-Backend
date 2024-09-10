import { getUser, updateUserController } from "../controllers/user.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/profile/:userId', authMiddleware, getUser);
router.put('/profile', authMiddleware, updateUserController);

export default router;