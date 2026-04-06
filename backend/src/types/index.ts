import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}