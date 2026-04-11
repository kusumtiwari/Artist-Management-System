import { Request, Response } from 'express'
import { AuthService } from '../services/auth'
import { ErrorHandler } from '../utils/validation'

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.signup(req.body)
      res.status(201).json({ success: true, user })
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body)

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 2 minutes for testing
      })

      res.status(200).json({ success: true, user })
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error)
    }
  }

  static async me(req: Request, res: Response) {
    res.status(200).json({ success: true, user: (req as any).user })
  }

  static async logout(_req: Request, res: Response) {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: 'Logged out' })
  }
}