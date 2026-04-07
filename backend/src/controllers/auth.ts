import { Request, Response } from 'express'
import { AuthService } from '../services/auth'

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.signup(req.body)

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.status(201).json({ success: true, user })
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { user, token } = await AuthService.login(req.body)

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.status(200).json({ success: true, user })
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message })
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