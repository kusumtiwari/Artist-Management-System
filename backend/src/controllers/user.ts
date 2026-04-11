import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { CreateUserData } from '../types';
import { AuthUtils } from '../utils/auth';
import { Validators, ValidationError, ErrorHandler } from '../utils/validation';

const mapGenderValue = (gender?: string): 'male' | 'female' | 'other' | undefined => {
  if (!gender) return undefined;
  const genderMap: { [key: string]: 'male' | 'female' | 'other' } = {
    'm': 'male',
    'f': 'female',
    'o': 'other',
    'male': 'male',
    'female': 'female',
    'other': 'other',
  };
  return genderMap[gender];
};

const validatePhone = (phone?: string): boolean => {
  if (!phone) return true; // Phone is optional
  // Only allow digits and + character
  return /^[+]?[0-9]{1,20}$/.test(phone);
};

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const userData: CreateUserData = req.body;

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

      // Validate phone if provided
      if (userData.phone && !Validators.phone(userData.phone)) {
        throw new ValidationError('phone', 'Please enter a valid phone number');
      }

      // Validate gender if provided
      if (userData.gender && !Validators.gender(userData.gender)) {
        throw new ValidationError('gender', 'Gender must be male, female, or other');
      }

      // Validate date of birth if provided
      if (userData.dob) {
        const dobValidation = Validators.dateOfBirth(userData.dob);
        if (!dobValidation.valid) {
          throw new ValidationError('dob', dobValidation.errors[0]);
        }
      }

      // Validate address if provided
      if (userData.address) {
        const addressValidation = Validators.address(userData.address);
        if (!addressValidation.valid) {
          throw new ValidationError('address', addressValidation.errors[0]);
        }
      }

      // Check if user already exists
      const exists = await UserModel.exists(userData.email, userData.first_name, userData.last_name);
      if (exists) {
        throw new ValidationError('email', 'This email is already in use');
      }

      // Hash password and create user
      const hashedPassword = await AuthUtils.hashPassword(userData.password);
      const mappedGender = mapGenderValue(userData.gender);
      const user = await UserModel.create({ ...userData, gender: mappedGender, isAdmin: userData.isAdmin ?? false }, hashedPassword);

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = req.query.search as string;
      const offset = (page - 1) * pageSize;

      // Get users with pagination and search
      const users = await UserModel.findAll(pageSize, offset, search);

      // Get total count with search filter
      const total = await UserModel.count(search);

      const totalPages = Math.ceil(total / pageSize);

      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        users: usersWithoutPasswords,
        pagination: {
          page,
          pageSize,
          total,
          totalPages
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const updateData: Partial<CreateUserData> = req.body;

      // Validate if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        throw new ValidationError('id', 'User not found');
      }

      // Validate email format if provided
      if (updateData.email && !Validators.email(updateData.email)) {
        throw new ValidationError('email', 'Please enter a valid email address');
      }

      // Validate password strength if provided
      if (updateData.password) {
        const passwordValidation = Validators.password(updateData.password);
        if (!passwordValidation.valid) {
          throw new ValidationError('password', passwordValidation.errors[0]);
        }
      }

      // Validate names if provided
      if (updateData.first_name) {
        const firstNameValidation = Validators.validateName(updateData.first_name, 'First name');
        if (!firstNameValidation.valid) {
          throw new ValidationError('first_name', firstNameValidation.errors[0]);
        }
      }

      if (updateData.last_name) {
        const lastNameValidation = Validators.validateName(updateData.last_name, 'Last name');
        if (!lastNameValidation.valid) {
          throw new ValidationError('last_name', lastNameValidation.errors[0]);
        }
      }

      // Validate phone if provided
      if (updateData.phone && !Validators.phone(updateData.phone)) {
        throw new ValidationError('phone', 'Please enter a valid phone number');
      }

      // Validate gender if provided
      if (updateData.gender && !Validators.gender(updateData.gender)) {
        throw new ValidationError('gender', 'Gender must be male, female, or other');
      }

      // Validate date of birth if provided
      if (updateData.dob) {
        const dobValidation = Validators.dateOfBirth(updateData.dob);
        if (!dobValidation.valid) {
          throw new ValidationError('dob', dobValidation.errors[0]);
        }
      }

      // Validate address if provided
      if (updateData.address) {
        const addressValidation = Validators.address(updateData.address);
        if (!addressValidation.valid) {
          throw new ValidationError('address', addressValidation.errors[0]);
        }
      }

      // Hash password if provided
      let hashedPassword;
      if (updateData.password) {
        hashedPassword = await AuthUtils.hashPassword(updateData.password);
      }

      // Map gender value if provided
      const mappedGender = updateData.gender ? mapGenderValue(updateData.gender) : undefined;

      // Update user
      const updatedUser = await UserModel.update(id, { ...updateData, gender: mappedGender }, hashedPassword);

      if (!updatedUser) {
        throw new ValidationError('id', 'User not found');
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const updateData: Partial<CreateUserData> = req.body;
      const currentUserId = req.user?.id;
      const isAdmin = req.user?.isAdmin;

      // Allow update if user is editing their own profile OR is admin
      if (currentUserId !== id && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden: you can only edit your own profile' });
      }

      // Validate if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        throw new ValidationError('id', 'User not found');
      }

      // Validate email format if provided
      if (updateData.email && !Validators.email(updateData.email)) {
        throw new ValidationError('email', 'Please enter a valid email address');
      }

      // Validate password strength if provided
      if (updateData.password) {
        const passwordValidation = Validators.password(updateData.password);
        if (!passwordValidation.valid) {
          throw new ValidationError('password', passwordValidation.errors[0]);
        }
      }

      // Validate names if provided
      if (updateData.first_name) {
        const firstNameValidation = Validators.validateName(updateData.first_name, 'First name');
        if (!firstNameValidation.valid) {
          throw new ValidationError('first_name', firstNameValidation.errors[0]);
        }
      }

      if (updateData.last_name) {
        const lastNameValidation = Validators.validateName(updateData.last_name, 'Last name');
        if (!lastNameValidation.valid) {
          throw new ValidationError('last_name', lastNameValidation.errors[0]);
        }
      }

      // Validate phone if provided
      if (updateData.phone && !Validators.phone(updateData.phone)) {
        throw new ValidationError('phone', 'Please enter a valid phone number');
      }

      // Validate gender if provided
      if (updateData.gender && !Validators.gender(updateData.gender)) {
        throw new ValidationError('gender', 'Gender must be male, female, or other');
      }

      // Validate date of birth if provided
      if (updateData.dob) {
        const dobValidation = Validators.dateOfBirth(updateData.dob);
        if (!dobValidation.valid) {
          throw new ValidationError('dob', dobValidation.errors[0]);
        }
      }

      // Validate address if provided
      if (updateData.address) {
        const addressValidation = Validators.address(updateData.address);
        if (!addressValidation.valid) {
          throw new ValidationError('address', addressValidation.errors[0]);
        }
      }

      // Prevent non-admins from changing isAdmin flag
      if (!isAdmin && updateData.isAdmin !== undefined) {
        delete updateData.isAdmin;
      }

      // Hash password if provided
      let hashedPassword;
      if (updateData.password) {
        hashedPassword = await AuthUtils.hashPassword(updateData.password);
      }

      // Map gender value if provided
      const mappedGender = updateData.gender ? mapGenderValue(updateData.gender) : undefined;

      // Update user
      const updatedUser = await UserModel.update(id, { ...updateData, gender: mappedGender }, hashedPassword);

      if (!updatedUser) {
        throw new ValidationError('id', 'User not found');
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const currentUserId = req.user?.id;
      const isAdmin = req.user?.isAdmin;

      // Allow delete if user is deleting their own account OR is admin
      if (currentUserId !== id && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Forbidden: you can only delete your own account' });
      }

      // Check if user exists
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const deleted = await UserModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);

      // Check if user exists
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Prevent deleting self
      if (req.user && req.user.id === id) {
        return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
      }

      const deleted = await UserModel.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}