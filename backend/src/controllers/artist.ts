import { Request, Response } from 'express';
import { ArtistService } from '../services/artist';
import { CreateArtistData } from '../types';
import { ErrorHandler } from '../utils/validation';

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

      const artists = await ArtistService.findAll(pageSize, offset, search);
      const total = await ArtistService.count(search);
      const totalPages = Math.ceil(total / pageSize);

      res.status(200).json({
        success: true,
        artists: artists,
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
      const artist = await ArtistService.getById(id);

      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.status(200).json({ success: true, artist });
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
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
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
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
    } catch (error) {
      ErrorHandler.sendErrorResponse(res, error);
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

      // convert binary to string and pass to service
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