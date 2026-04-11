import { UserModel } from '../models/user';
import { AuthUtils } from '../utils/auth';
import { Validators, ValidationError } from '../utils/validation';
import { CreateUserData, LoginData, AuthResponse } from '../types';

export class AuthService {
  static async signup(userData: CreateUserData): Promise<AuthResponse> {
    // Validate required fields
    if (!userData.first_name) {
      throw new ValidationError('first_name', 'First name is required');
    }
    if (!userData.last_name) {
      throw new ValidationError('last_name', 'Last name is required');
    }
    if (!userData.email) {
      throw new ValidationError('email', 'Email is required');
    }
    if (!userData.password) {
      throw new ValidationError('password', 'Password is required');
    }

    // Validate email format
    if (!Validators.email(userData.email)) {
      throw new ValidationError('email', 'Please enter a valid email address');
    }

    // Validate password strength
    const passwordValidation = Validators.password(userData.password);
    if (!passwordValidation.valid) {
      throw new ValidationError('password', passwordValidation.errors[0]);
    }

    // Validate names
    const firstNameValidation = Validators.validateName(userData.first_name, 'First name');
    if (!firstNameValidation.valid) {
      throw new ValidationError('first_name', firstNameValidation.errors[0]);
    }

    const lastNameValidation = Validators.validateName(userData.last_name, 'Last name');
    if (!lastNameValidation.valid) {
      throw new ValidationError('last_name', lastNameValidation.errors[0]);
    }

    // Check if user already exists
    const exists = await UserModel.exists(userData.email, userData.first_name, userData.last_name);
    if (exists) {
      throw new ValidationError('email', 'This email is already in use');
    }

    const hashedPassword = await AuthUtils.hashPassword(userData.password);

    const user = await UserModel.create({ ...userData, isAdmin: true }, hashedPassword);

    const token = AuthUtils.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    if (!loginData.email) {
      throw new ValidationError('email', 'Email is required');
    }
    if (!loginData.password) {
      throw new ValidationError('password', 'Password is required');
    }

    // Validate email format
    if (!Validators.email(loginData.email)) {
      throw new ValidationError('email', 'Please enter a valid email address');
    }

    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new ValidationError('email', 'No account found with this email address');
    }

    const isValid = await AuthUtils.verifyPassword(loginData.password, user.password);
    if (!isValid) {
      throw new ValidationError('password', 'Incorrect password');
    }

    const token = AuthUtils.generateToken(user.id);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}