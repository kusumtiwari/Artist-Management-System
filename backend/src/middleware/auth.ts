import { Request, Response, NextFunction } from "express";
import pool from "../config/db";
import { AuthUtils } from "../utils/auth";
import { User } from "../types";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token);

    // Get user from database
    const [rows] = await pool.execute(
      "SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?",
      [decoded.userId],
    );

    const users = rows as User[];
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request (without password)
    req.user = users[0];
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
