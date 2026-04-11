import { SongModel } from '../models/song';
import { CreateSongData, Song, SongWithArtist } from '../types';
import { Validators, ValidationError } from '../utils/validation';

export class SongService {
  static async create(songData: CreateSongData): Promise<Song> {
    // Validate required fields
    if (!songData.title) {
      throw new ValidationError('title', 'Song title is required');
    }
    if (!songData.genre) {
      throw new ValidationError('genre', 'Genre is required');
    }
    if (!songData.artist_id) {
      throw new ValidationError('artist_id', 'Artist ID is required');
    }

    // Validate title
    const titleValidation = Validators.songTitle(songData.title);
    if (!titleValidation.valid) {
      throw new ValidationError('title', titleValidation.errors[0]);
    }

    // Validate genre
    if (!Validators.genre(songData.genre)) {
      throw new ValidationError('genre', 'Genre must be one of: rnb, country, classic, rock, jazz');
    }

    // Validate album name if provided
    if (songData.album_name) {
      const albumValidation = Validators.albumName(songData.album_name);
      if (!albumValidation.valid) {
        throw new ValidationError('album_name', albumValidation.errors[0]);
      }
    }

    // Check if artist exists
    const { ArtistModel } = await import('../models/artist');
    const artist = await ArtistModel.findById(songData.artist_id);
    if (!artist) {
      throw new ValidationError('artist_id', 'Artist not found');
    }

    return SongModel.create(songData);
  }

  static async getByArtistId(artistId: number, page: number = 1, limit: number = 10, search: string = ''): Promise<{ songs: SongWithArtist[], total: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    const songs = await SongModel.findByArtistId(artistId, limit, offset, search);
    const total = await SongModel.countByArtistId(artistId, search);
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
      throw new ValidationError('id', 'Song not found');
    }

    // Validate title if provided
    if (songData.title) {
      const titleValidation = Validators.songTitle(songData.title);
      if (!titleValidation.valid) {
        throw new ValidationError('title', titleValidation.errors[0]);
      }
    }

    // Validate genre if provided
    if (songData.genre && !Validators.genre(songData.genre)) {
      throw new ValidationError('genre', 'Genre must be one of: rnb, country, classic, rock, jazz');
    }

    // Validate album name if provided
    if (songData.album_name) {
      const albumValidation = Validators.albumName(songData.album_name);
      if (!albumValidation.valid) {
        throw new ValidationError('album_name', albumValidation.errors[0]);
      }
    }

    // Validate artist_id if provided
    if (songData.artist_id) {
      const { ArtistModel } = await import('../models/artist');
      const artist = await ArtistModel.findById(songData.artist_id);
      if (!artist) {
        throw new ValidationError('artist_id', 'Artist not found');
      }
    }

    return SongModel.update(id, songData);
  }

  static async delete(id: number): Promise<boolean> {
    // Check if song exists
    const song = await SongModel.findById(id);
    if (!song) {
      throw new ValidationError('id', 'Song not found');
    }

    return SongModel.delete(id);
  }
}