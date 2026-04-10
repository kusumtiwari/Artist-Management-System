import { ArtistModel } from '../models/artist';
import { CreateArtistData, Artist } from '../types';
import { CSVParser, CSVValidator } from '../utils/csv';

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

  static async findAll(limit: number = 10, offset: number = 0, search: string = ''): Promise<Artist[]> {
    return ArtistModel.findAll(limit, offset, search);
  }

  static async count(search: string = ''): Promise<number> {
    return ArtistModel.count(search);
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

    const headers = ['Name', 'Date of Birth', 'Gender', 'Address', 'First Release Year', 'Albums Released'];
    const rows: string[][] = [];

    for (const artist of artists) {
      const dob = artist.dob 
        ? (typeof artist.dob === 'string' ? artist.dob : new Date(artist.dob).toISOString().split('T')[0])
        : '';
      
      rows.push([
        artist.name,
        dob,
        artist.gender,
        artist.address || '',
        artist.first_release_year?.toString() || '',
        artist.no_of_albums_released?.toString() || ''
      ]);
    }

    return CSVParser.stringify(headers, rows) + '\n';
  }

  static async importFromCSV(csvData: string): Promise<{ imported: number, errors: string[] }> {
    const rows = CSVParser.parse(csvData);
    
    if (rows.length < 2) {
      throw new Error('CSV file is empty or contains only headers');
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    
    // Validate headers
    const headerValidation = CSVValidator.validateHeaders(rows[0]);
    if (!headerValidation.valid) {
      throw new Error(headerValidation.error);
    }

    const errors: string[] = [];
    let imported = 0;

    // Create column index map
    const columnMap = this.createColumnMap(headers);

    // Process data rows
    for (let i = 1; i < rows.length; i++) {
      try {
        const columns = rows[i];

        // Skip empty rows
        if (columns.every(col => !col.trim())) {
          continue;
        }

        // Map columns to object
        const rowData = this.mapRowToObject(columns, columnMap);

        // Validate row
        const validation = CSVValidator.validateRow(rowData, i + 1);
        if (!validation.valid) {
          errors.push(...validation.errors);
          continue;
        }

        // Create artist
        const artistData: CreateArtistData = {
          name: rowData.name,
          gender: rowData.gender.toLowerCase() as 'male' | 'female' | 'other',
          dob: rowData.dob || undefined,
          address: rowData.address || undefined,
          first_release_year: rowData.first_release_year ? parseInt(rowData.first_release_year, 10) : undefined,
          no_of_albums_released: rowData.no_of_albums_released ? parseInt(rowData.no_of_albums_released, 10) : undefined
        };

        await this.create(artistData);
        imported++;
      } catch (error: any) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return { imported, errors };
  }

  private static createColumnMap(headers: string[]): Record<string, number> {
    const map: Record<string, number> = {};
    
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].trim().toLowerCase();
      
      if (header === 'id') map.id = i;
      else if (header === 'name') map.name = i;
      else if (header === 'date of birth' || header === 'dob' || header === 'date_of_birth') map.dob = i;
      else if (header === 'gender') map.gender = i;
      else if (header === 'address') map.address = i;
      else if (header === 'first release year' || header === 'first_release_year') map.first_release_year = i;
      else if (header === 'albums released' || header === 'albums_released' || header === 'no_of_albums_released' || header === 'no of albums released') map.no_of_albums_released = i;
    }

    return map;
  }

  private static mapRowToObject(columns: string[], columnMap: Record<string, number>): Record<string, string> {
    return {
      id: columns[columnMap.id]?.trim() || '',
      name: columns[columnMap.name]?.trim() || '',
      dob: columns[columnMap.dob]?.trim() || '',
      gender: columns[columnMap.gender]?.trim() || '',
      address: columns[columnMap.address]?.trim() || '',
      first_release_year: columns[columnMap.first_release_year]?.trim() || '',
      no_of_albums_released: columns[columnMap.no_of_albums_released]?.trim() || ''
    };
  }
}