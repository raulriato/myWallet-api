import { signIn, signUp } from "../controllers/auth.controller.js";
import express from "express";
import { signInMiddleware } from "../middlewares/signInMiddleware.js";
import { signUpMiddleware } from "../middlewares/signUpMiddleware.js";

const router = express.Router();

router.post("/sign-in", signInMiddleware, signIn);
router.post("/sign-up",signUpMiddleware, signUp);

export default router;