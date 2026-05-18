import express from "express";
import { getTransactions, createTransaction, deleteTransaction, updateTransaction } from "../Controller/transaction.js";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../Controller/category.js";
import { getSettings, updateSettings } from "../Controller/settings.js";
import { getBooks, createBook, deleteBook } from "../Controller/book.js";

import authRoutes from "./auth.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

// Auth
router.use("/auth", authRoutes);

// Books (Protected)
router.get("/books", authMiddleware, getBooks);
router.post("/books", authMiddleware, createBook);
router.delete("/books/:id", authMiddleware, deleteBook);

// Transactions (Protected)
router.get("/transactions", authMiddleware, getTransactions);
router.post("/transactions", authMiddleware, createTransaction);
router.put("/transactions/:id", authMiddleware, updateTransaction);
router.delete("/transactions/:id", authMiddleware, deleteTransaction);

// Categories (Protected)
router.get("/categories", authMiddleware, getCategories);
router.post("/categories", authMiddleware, createCategory);
router.put("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

// Settings (Protected)
router.get("/settings", authMiddleware, getSettings);
router.post("/settings", authMiddleware, updateSettings);

export default router;
