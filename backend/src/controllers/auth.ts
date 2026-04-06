// controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const data = await AuthService.signup(req.body);
      res.status(201).json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data = await AuthService.login(req.body);
      res.status(200).json(data);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}