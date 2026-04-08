import pool from '../config/db';
import { Song, CreateSongData, SongWithArtist } from '../types';

export class SongModel {
  static async create(songData: CreateSongData): Promise<Song> {
    const [result]: any = await pool.execute(
      'INSERT INTO songs (artist_id, title, album_name, genre, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [
        songData.artist_id,
        songData.title,
        songData.album_name || null,
        songData.genre
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM songs WHERE id = ?',
      [result.insertId]
    );

    return (rows as Song[])[0];
  }

  static async findById(id: number): Promise<Song | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM songs WHERE id = ?',
      [id]
    );

    const songs = rows as Song[];
    return songs.length ? songs[0] : null;
  }

  static async findByArtistId(artistId: number, limit: number = 10, offset: number = 0): Promise<SongWithArtist[]> {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const safeOffset = Number.isInteger(offset) && offset >= 0 ? offset : 0;
    const query = `SELECT s.*, a.name as artist_name
       FROM songs s
       JOIN artists a ON s.artist_id = a.id
       WHERE s.artist_id = ?
       ORDER BY s.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const [rows] = await pool.execute(query, [artistId]);

    return rows as SongWithArtist[];
  }

  static async countByArtistId(artistId: number): Promise<number> {
    const [rows]: any = await pool.execute(
      'SELECT COUNT(*) as count FROM songs WHERE artist_id = ?',
      [artistId]
    );

    return rows[0].count;
  }

  static async update(id: number, songData: Partial<CreateSongData>): Promise<Song | null> {
    const updateFields: string[] = [];
    const values: any[] = [];

    if (songData.title !== undefined) {
      updateFields.push('title = ?');
      values.push(songData.title);
    }
    if (songData.album_name !== undefined) {
      updateFields.push('album_name = ?');
      values.push(songData.album_name);
    }
    if (songData.genre !== undefined) {
      updateFields.push('genre = ?');
      values.push(songData.genre);
    }

    if (updateFields.length === 0) {
      return null;
    }

    updateFields.push('updated_at = NOW()');
    values.push(id);

    await pool.execute(
      `UPDATE songs SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.execute(
      'DELETE FROM songs WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }
}