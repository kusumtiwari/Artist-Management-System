import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db";
import { initializeDatabase } from "./config/initDb";
import env from "./config/env";
import authRoutes from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
const start = async () => {
  await testConnection();
  await initializeDatabase();
  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};
start();

export default app;
