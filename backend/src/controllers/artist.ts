import { Request, Response } from 'express';
import { ArtistService } from '../services/artist';
import { CreateArtistData } from '../types';

// Extend Request to include multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class ArtistController {
  static async create(req: Request, res: Response) {
    try {
      const artistData: CreateArtistData = req.body;
      const artist = await ArtistService.create(artistData);
      res.status(201).json({ success: true, artist });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ArtistService.getAll(page, limit);
      res.status(200).json({
        success: true,
        artists: result.artists,
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
      const artist = await ArtistService.getById(id);

      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.status(200).json({ success: true, artist });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const artistData: Partial<CreateArtistData> = req.body;

      const artist = await ArtistService.update(id, artistData);

      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.status(200).json({ success: true, artist });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const deleted = await ArtistService.delete(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.status(200).json({ success: true, message: 'Artist deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async exportCSV(req: Request, res: Response) {
    try {
      const csvData = await ArtistService.exportToCSV();

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=artists.csv');
      res.status(200).send(csvData);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async importCSV(req: MulterRequest, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const csvData = req.file.buffer.toString('utf-8');
      const result = await ArtistService.importFromCSV(csvData);

      res.status(200).json({
        success: true,
        message: `Imported ${result.imported} artists successfully`,
        imported: result.imported,
        errors: result.errors
      });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}