import { SongModel } from '../models/song';
import { CreateSongData, Song, SongWithArtist } from '../types';

export class SongService {
  static async create(songData: CreateSongData): Promise<Song> {
    // Validate required fields
    if (!songData.title || !songData.genre || !songData.artist_id) {
      throw new Error('Title, genre, and artist_id are required');
    }

    // Validate genre enum
    const validGenres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'other'];
    if (!validGenres.includes(songData.genre)) {
      throw new Error('Invalid genre value');
    }

    // Check if artist exists
    const { ArtistModel } = await import('../models/artist');
    const artist = await ArtistModel.findById(songData.artist_id);
    if (!artist) {
      throw new Error('Artist not found');
    }

    return SongModel.create(songData);
  }

  static async getByArtistId(artistId: number, page: number = 1, limit: number = 10): Promise<{ songs: SongWithArtist[], total: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    const songs = await SongModel.findByArtistId(artistId, limit, offset);
    const total = await SongModel.countByArtistId(artistId);
    const totalPages = Math.ceil(total / limit);

    return { songs, total, totalPages };
  }

  static async getById(id: number): Promise<Song | null> {
    return SongModel.findById(id);
  }

  static async update(id: number, songData: Partial<CreateSongData>): Promise<Song | null> {
    // Validate if song exists
    const existingSong = await SongModel.findById(id);
    if (!existingSong) {
      throw new Error('Song not found');
    }

    // Validate genre if provided
    if (songData.genre) {
      const validGenres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country', 'other'];
      if (!validGenres.includes(songData.genre)) {
        throw new Error('Invalid genre value');
      }
    }

    // Validate artist_id if provided
    if (songData.artist_id) {
      const { ArtistModel } = await import('../models/artist');
      const artist = await ArtistModel.findById(songData.artist_id);
      if (!artist) {
        throw new Error('Artist not found');
      }
    }

    return SongModel.update(id, songData);
  }

  static async delete(id: number): Promise<boolean> {
    // Check if song exists
    const song = await SongModel.findById(id);
    if (!song) {
      throw new Error('Song not found');
    }

    return SongModel.delete(id);
  }
}