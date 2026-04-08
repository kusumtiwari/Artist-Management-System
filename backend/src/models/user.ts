// models/userModel.ts
import pool from '../config/db';
import { User, CreateUserData } from '../types';

export class UserModel {
  private static mapUserRow(row: any): User {
    return {
      ...row,
      isAdmin: Boolean(row.isAdmin),
    } as User;
  }

  static async create(userData: CreateUserData, hashedPassword: string): Promise<User> {
    const fields = ['first_name', 'last_name', 'email', 'password'];
    const values: any[] = [userData.first_name, userData.last_name, userData.email, hashedPassword];
    const placeholders = ['?', '?', '?', '?'];

    if (userData.phone !== undefined) {
      fields.push('phone');
      values.push(userData.phone);
      placeholders.push('?');
    }
    if (userData.dob !== undefined) {
      fields.push('dob');
      values.push(userData.dob);
      placeholders.push('?');
    }
    if (userData.gender !== undefined) {
      fields.push('gender');
      values.push(userData.gender);
      placeholders.push('?');
    }
    if (userData.address !== undefined) {
      fields.push('address');
      values.push(userData.address);
      placeholders.push('?');
    }
    if (userData.isAdmin !== undefined) {
      fields.push('is_admin');
      values.push(userData.isAdmin ? 1 : 0);
      placeholders.push('?');
    }

    fields.push('created_at', 'updated_at');
    placeholders.push('NOW()', 'NOW()');

    const insertQuery = `INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;

    const [result]: any = await pool.execute(insertQuery, values);

    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, dob, gender, address, is_admin as isAdmin, created_at, updated_at FROM users WHERE id = ?',
      [result.insertId]
    );

    return this.mapUserRow((rows as any[])[0]);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, password, phone, dob, gender, address, is_admin as isAdmin, created_at, updated_at FROM users WHERE email = ?',
      [email]
    );

    const users = rows as any[];
    return users.length ? this.mapUserRow(users[0]) : null;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, email, password, phone, dob, gender, address, is_admin as isAdmin, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    const users = rows as any[];
    return users.length ? this.mapUserRow(users[0]) : null;
  }

  static async findAll(limit: number = 10, offset: number = 0, search?: string): Promise<User[]> {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;

    let query = `SELECT id, first_name, last_name, email, phone, dob, gender, address, is_admin as isAdmin, created_at, updated_at FROM users`;
    let whereClause = '';
    const params: any[] = [];

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereClause = ` WHERE (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(searchTerm, searchTerm);
    }

    query += `${whereClause} ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [rows] = await pool.execute(query, params);

    return (rows as any[]).map((row) => this.mapUserRow(row));
  }

  static async count(search?: string): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM users';
    const params: any[] = [];

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query += ` WHERE (first_name LIKE ? OR last_name LIKE ?)`;
      params.push(searchTerm, searchTerm);
    }

    const [rows]: any = await pool.execute(query, params);

    return rows[0].count;
  }

  static async update(id: number, userData: Partial<CreateUserData>, hashedPassword?: string): Promise<User | null> {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (userData.first_name !== undefined) {
      updateFields.push('first_name = ?');
      values.push(userData.first_name);
    }
    if (userData.last_name !== undefined) {
      updateFields.push('last_name = ?');
      values.push(userData.last_name);
    }
    if (userData.email !== undefined) {
      updateFields.push('email = ?');
      values.push(userData.email);
    }
    if (hashedPassword) {
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    if (userData.phone !== undefined) {
      updateFields.push('phone = ?');
      values.push(userData.phone);
    }
    if (userData.dob !== undefined) {
      updateFields.push('dob = ?');
      values.push(userData.dob);
    }
    if (userData.gender !== undefined) {
      updateFields.push('gender = ?');
      values.push(userData.gender);
    }
    if (userData.address !== undefined) {
      updateFields.push('address = ?');
      values.push(userData.address);
    }
    if (userData.isAdmin !== undefined) {
      updateFields.push('is_admin = ?');
      values.push(userData.isAdmin ? 1 : 0);
    }

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  static async exists(email: string, first_name: string, last_name: string): Promise<boolean> {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ? OR (first_name = ? AND last_name = ?) LIMIT 1',
      [email, first_name, last_name]
    );

    return (rows as any[]).length > 0;
  }
}