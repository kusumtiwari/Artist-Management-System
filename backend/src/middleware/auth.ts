import { Request, Response, NextFunction } from 'express'
import pool from '../config/db'
import { AuthUtils } from '../utils/auth'
import { User } from '../types'

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
      return
    }
    const decoded = AuthUtils.verifyToken(token);
    console.log('decoded:', decoded)
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, dob, gender, address, is_admin as isAdmin, created_at, updated_at FROM users WHERE id = ?',
      [decoded.userId],
    )

    const users = rows as any[]
    if (users.length === 0) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      })
      return
    }

    const userRow = users[0]
    req.user = {
      ...userRow,
      isAdmin: Boolean(userRow.isAdmin),
    }
    next()
  } catch (error) {
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: 'Invalid token' })
      return
    }
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expired' })
      return
    }
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, message: 'Forbidden: admin access required' })
  }

  next()
}