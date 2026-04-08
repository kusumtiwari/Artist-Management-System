import { Request, Response } from 'express';
import { SongService } from '../services/song';
import { CreateSongData } from '../types';

export class SongController {
  static async create(req: Request, res: Response) {
    try {
      const songData: CreateSongData = req.body;
      const song = await SongService.create(songData);
      res.status(201).json({ success: true, song });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getByArtistId(req: Request, res: Response) {
    try {
      const artistId = parseInt(req.params.artistId as string);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await SongService.getByArtistId(artistId, page, limit);
      res.status(200).json({
        success: true,
        songs: result.songs,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const song = await SongService.getById(id);

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      res.status(200).json({ success: true, song });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const songData: Partial<CreateSongData> = req.body;

      const song = await SongService.update(id, songData);

      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      res.status(200).json({ success: true, song });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await SongService.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Song not found' });
      }

      res.status(200).json({ success: true, message: 'Song deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}