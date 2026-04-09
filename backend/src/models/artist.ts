import pool from '../config/db';
import { Artist, CreateArtistData } from '../types';

export class ArtistModel {
  static async create(artistData: CreateArtistData): Promise<Artist> {
    const [result]: any = await pool.execute(
      'INSERT INTO artists (name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        artistData.name,
        artistData.dob || null,
        artistData.gender,
        artistData.address || null,
        artistData.first_release_year || null,
        artistData.no_of_albums_released || 0
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM artists WHERE id = ?',
      [result.insertId]
    );

    return (rows as Artist[])[0];
  }

  static async findById(id: number): Promise<Artist | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM artists WHERE id = ?',
      [id]
    );

    const artists = rows as Artist[];
    return artists.length ? artists[0] : null;
  }

  static async findAll(limit: number = 10, offset: number = 0, search: string = ''): Promise<Artist[]> {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;
    
    let query = `SELECT * FROM artists`;
    const params: any[] = [];

    if (search) {
      query += ` WHERE name LIKE ?`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [rows] = await pool.execute(query, params);

    return rows as Artist[];
  }

  static async count(search: string = ''): Promise<number> {
    let query = 'SELECT COUNT(*) as count FROM artists';
    const params: any[] = [];

    if (search) {
      query += ` WHERE name LIKE ?`;
      params.push(`%${search}%`);
    }

    const [rows]: any = await pool.execute(query, params);
    return rows[0].count;
  }

  static async update(id: number, artistData: Partial<CreateArtistData>): Promise<Artist | null> {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (artistData.name !== undefined) {
      updateFields.push('name = ?');
      values.push(artistData.name);
    }
    if (artistData.dob !== undefined) {
      updateFields.push('dob = ?');
      values.push(artistData.dob);
    }
    if (artistData.gender !== undefined) {
      updateFields.push('gender = ?');
      values.push(artistData.gender);
    }
    if (artistData.address !== undefined) {
      updateFields.push('address = ?');
      values.push(artistData.address);
    }
    if (artistData.first_release_year !== undefined) {
      updateFields.push('first_release_year = ?');
      values.push(artistData.first_release_year);
    }
    if (artistData.no_of_albums_released !== undefined) {
      updateFields.push('no_of_albums_released = ?');
      values.push(artistData.no_of_albums_released);
    }

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE artists SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.execute(
      'DELETE FROM artists WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  static async getAllForExport(): Promise<Artist[]> {
    const [rows] = await pool.execute(
      'SELECT id, name, dob, gender, address, first_release_year, no_of_albums_released, created_at, updated_at FROM artists ORDER BY name'
    );

    return rows as Artist[];
  }
}