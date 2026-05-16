import express from "express";
import { getTransactions, createTransaction, deleteTransaction } from "../Controller/transaction.js";
import { getCategories, createCategory } from "../Controller/category.js";
import { getSettings, updateSettings } from "../Controller/settings.js";

import authRoutes from "./auth.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// Auth
router.use("/auth", authRoutes);

// Transactions (Protected)
router.get("/transactions", authMiddleware, getTransactions);
router.post("/transactions", authMiddleware, createTransaction);
router.delete("/transactions/:id", authMiddleware, deleteTransaction);

// Categories (Protected)
router.get("/categories", authMiddleware, getCategories);
router.post("/categories", authMiddleware, createCategory);

// Settings (Protected)
router.get("/settings", authMiddleware, getSettings);
router.post("/settings", authMiddleware, updateSettings);

export default router;
