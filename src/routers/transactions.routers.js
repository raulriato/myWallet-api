import { listTransactions, createTransaction } from "../controllers/transactions.controller.js";
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { transactionMiddleware } from "../middlewares/transactionMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/transactions", listTransactions);
router.post("/transactions", transactionMiddleware, createTransaction);

export default router;