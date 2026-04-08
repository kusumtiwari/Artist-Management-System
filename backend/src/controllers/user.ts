import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { CreateUserData } from '../types';
import { AuthUtils } from '../utils/auth';

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

export class UserController {
  static async create(req: Request, res: Response) {
    try {
      const userData: CreateUserData = req.body;

      // Validate required fields
      if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }

      if (userData.password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
      }

      // Check if user exists
      const exists = await UserModel.exists(userData.email, userData.first_name, userData.last_name);
      if (exists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Hash password and create user
      const hashedPassword = await AuthUtils.hashPassword(userData.password);
      const mappedGender = mapGenderValue(userData.gender);
      const user = await UserModel.create({ ...userData, gender: mappedGender, isAdmin: userData.isAdmin ?? false }, hashedPassword);

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
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
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Hash password if provided
      let hashedPassword;
      if (updateData.password) {
        if (updateData.password.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        hashedPassword = await AuthUtils.hashPassword(updateData.password);
      }

      // Map gender value if provided
      const mappedGender = updateData.gender ? mapGenderValue(updateData.gender) : undefined;

      // Update user
      const updatedUser = await UserModel.update(id, { ...updateData, gender: mappedGender }, hashedPassword);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
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
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Prevent non-admins from changing isAdmin flag
      if (!isAdmin && updateData.isAdmin !== undefined) {
        delete updateData.isAdmin;
      }

      // Hash password if provided
      let hashedPassword;
      if (updateData.password) {
        if (updateData.password.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        hashedPassword = await AuthUtils.hashPassword(updateData.password);
      }

      // Map gender value if provided
      const mappedGender = updateData.gender ? mapGenderValue(updateData.gender) : undefined;

      // Update user
      const updatedUser = await UserModel.update(id, { ...updateData, gender: mappedGender }, hashedPassword);

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({ success: true, user: userWithoutPassword });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
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