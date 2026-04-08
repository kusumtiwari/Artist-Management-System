import { ArtistModel } from '../models/artist';
import { CreateArtistData, Artist } from '../types';

export class ArtistService {
  static async create(artistData: CreateArtistData): Promise<Artist> {
    // Validate required fields
    if (!artistData.name || !artistData.gender) {
      throw new Error('Name and gender are required');
    }

    // Validate gender enum
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(artistData.gender)) {
      throw new Error('Invalid gender value');
    }

    // Validate first_release_year if provided
    if (artistData.first_release_year && (artistData.first_release_year < 1900 || artistData.first_release_year > new Date().getFullYear())) {
      throw new Error('Invalid first release year');
    }

    // Validate no_of_albums_released if provided
    if (artistData.no_of_albums_released && artistData.no_of_albums_released < 0) {
      throw new Error('Number of albums released cannot be negative');
    }

    return ArtistModel.create(artistData);
  }

  static async getAll(page: number = 1, limit: number = 10): Promise<{ artists: Artist[], total: number, totalPages: number }> {
    const offset = (page - 1) * limit;
    const artists = await ArtistModel.findAll(limit, offset);
    const total = await ArtistModel.count();
    const totalPages = Math.ceil(total / limit);

    return { artists, total, totalPages };
  }

  static async getById(id: number): Promise<Artist | null> {
    return ArtistModel.findById(id);
  }

  static async update(id: number, artistData: Partial<CreateArtistData>): Promise<Artist | null> {
    // Validate if artist exists
    const existingArtist = await ArtistModel.findById(id);
    if (!existingArtist) {
      throw new Error('Artist not found');
    }

    // Validate gender if provided
    if (artistData.gender) {
      const validGenders = ['male', 'female', 'other'];
      if (!validGenders.includes(artistData.gender)) {
        throw new Error('Invalid gender value');
      }
    }

    // Validate first_release_year if provided
    if (artistData.first_release_year && (artistData.first_release_year < 1900 || artistData.first_release_year > new Date().getFullYear())) {
      throw new Error('Invalid first release year');
    }

    // Validate no_of_albums_released if provided
    if (artistData.no_of_albums_released && artistData.no_of_albums_released < 0) {
      throw new Error('Number of albums released cannot be negative');
    }

    return ArtistModel.update(id, artistData);
  }

  static async delete(id: number): Promise<boolean> {
    // Check if artist exists
    const artist = await ArtistModel.findById(id);
    if (!artist) {
      throw new Error('Artist not found');
    }

    return ArtistModel.delete(id);
  }

  static async exportToCSV(): Promise<string> {
    const artists = await ArtistModel.getAllForExport();

    const headers = ['ID', 'Name', 'Date of Birth', 'Gender', 'Address', 'First Release Year', 'Albums Released', 'Created At', 'Updated At'];
    const csvRows = [headers.join(',')];

    for (const artist of artists) {
      const row = [
        artist.id,
        `"${artist.name}"`,
        artist.dob || '',
        artist.gender,
        `"${artist.address || ''}"`,
        artist.first_release_year || '',
        artist.no_of_albums_released,
        artist.created_at.toISOString(),
        artist.updated_at.toISOString()
      ];
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }

  static async importFromCSV(csvData: string): Promise<{ imported: number, errors: string[] }> {
    const lines = csvData.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    let imported = 0;

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i];
        // Simple CSV parsing (assuming no commas in quoted fields)
        const columns = line.split(',').map(col => col.replace(/^"|"$/g, ''));

        if (columns.length < 4) {
          errors.push(`Line ${i + 1}: Insufficient columns`);
          continue;
        }

        const [id, name, dob, gender, address, firstReleaseYear, albumsReleased] = columns;

        const artistData: CreateArtistData = {
          name: name.trim(),
          gender: gender.toLowerCase() as 'male' | 'female' | 'other',
          dob: dob.trim() || undefined,
          address: address.trim() || undefined,
          first_release_year: firstReleaseYear ? parseInt(firstReleaseYear) : undefined,
          no_of_albums_released: albumsReleased ? parseInt(albumsReleased) : undefined
        };

        await this.create(artistData);
        imported++;
      } catch (error: any) {
        errors.push(`Line ${i + 1}: ${error.message}`);
      }
    }

    return { imported, errors };
  }
}