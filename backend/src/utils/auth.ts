import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import env from "../config/env";

export class AuthUtils {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token

  static generateToken(userId: number): string {
    const payload = { userId };

    const secret: Secret = env.jwt.secret;

    const options: SignOptions = {
      expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, secret, options);
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: number } {
    return jwt.verify(token, env.jwt.secret) as { userId: number };
  }
}
