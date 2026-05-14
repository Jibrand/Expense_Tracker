import express from "express";
import { getTransactions, createTransaction, deleteTransaction } from "../Controller/transaction.js";
import { getCategories, createCategory } from "../Controller/category.js";
import { getSettings, updateSettings } from "../Controller/settings.js";

const router = express.Router();

// Transactions
router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);
router.delete("/transactions/:id", deleteTransaction);

// Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);

// Settings
router.get("/settings", getSettings);
router.post("/settings", updateSettings);

export default router;
