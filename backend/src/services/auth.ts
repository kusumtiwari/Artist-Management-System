import { UserModel } from '../models/user';
import { AuthUtils } from '../utils/auth';
import { CreateUserData, LoginData, AuthResponse } from '../types';

export class AuthService {
  static async signup(userData: CreateUserData): Promise<AuthResponse> {
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const exists = await UserModel.exists(userData.email, userData.first_name, userData.last_name);
    if (exists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await AuthUtils.hashPassword(userData.password);

    const user = await UserModel.create({ ...userData, isAdmin: true }, hashedPassword);

    const token = AuthUtils.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    if (!loginData.email || !loginData.password) {
      throw new Error('Email and password required');
    }

    const user = await UserModel.findByEmail(loginData.email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await AuthUtils.verifyPassword(loginData.password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = AuthUtils.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}