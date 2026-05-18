import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import apiRoutes from "./Routes/api.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://expense-tracker-silk-three-94.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isLocalhost = origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:");
    const isAllowedProduction = allowedOrigins.includes(origin);
    if (isLocalhost || isAllowedProduction) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Health Check
app.get("/", (req, res) => res.status(200).send("Expense Tracker API is running"));

// API Routes
app.use("/api", apiRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose.connect(CONNECTION_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log('Connected Successfully to MongoDB.');
    // Only listen locally, Vercel handles the serverless execution
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    }
})
.catch((err) => {
    console.log('Connection failed: ', err.message);
});

// Prevent crashes from unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
});

export default app;
