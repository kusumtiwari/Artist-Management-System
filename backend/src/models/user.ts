// models/userModel.ts
import pool from '../config/db';
import { User, CreateUserData } from '../types';

export class UserModel {
  static async create(userData: CreateUserData, hashedPassword: string): Promise<User> {
    const [result]: any = await pool.execute(
      'INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [userData.username, userData.email, hashedPassword]
    );

    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return (rows as User[])[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const users = rows as User[];
    return users.length ? users[0] : null;
  }

  static async exists(email: string, username: string): Promise<boolean> {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );

    return (rows as any[]).length > 0;
  }
}