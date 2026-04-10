/**
 * CSV parsing utilities for proper handling of quoted fields and edge cases
 */

export class CSVParser {
  /**
   * Parse a CSV line, properly handling quoted fields that may contain commas
   * @param line - A single CSV line
   * @returns Array of parsed values
   */
  static parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // Found field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(current.trim());
    return result;
  }

  /**
   * Parse entire CSV data
   * @param csvData - CSV content as string
   * @returns Array of rows, each row is an array of values
   */
  static parse(csvData: string): string[][] {
    const lines = csvData.split('\n').filter(line => line.trim());
    return lines.map(line => this.parseLine(line));
  }

  /**
   * Generate CSV from data
   * @param headers - Column headers
   * @param rows - Data rows
   * @returns CSV string
   */
  static stringify(headers: string[], rows: string[][]): string {
    const csvRows = [this.stringifyLine(headers)];

    for (const row of rows) {
      csvRows.push(this.stringifyLine(row));
    }

    return csvRows.join('\n');
  }

  /**
   * Convert a single row to CSV format (with proper quoting)
   * @param row - Array of values
   * @returns CSV line
   */
  static stringifyLine(row: string[]): string {
    return row
      .map(value => {
        // Quote value if it contains comma, newline, or quote
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(',');
  }
}

/**
 * Validate CSV data format
 */
export class CSVValidator {
  static readonly REQUIRED_HEADERS = ['Name', 'Gender'];
  static readonly VALID_GENDERS = ['male', 'female', 'other'];

  /**
   * Validate headers
   * @param headers - CSV headers
   * @returns { valid: boolean, error?: string }
   */
  static validateHeaders(headers: string[]): { valid: boolean; error?: string } {
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase());

    for (const required of this.REQUIRED_HEADERS) {
      if (!normalizedHeaders.includes(required.toLowerCase())) {
        return {
          valid: false,
          error: `Missing required column: ${required}`
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validate a single row
   * @param row - CSV row data
   * @param rowNumber - Row number (for error messages)
   * @returns { valid: boolean, errors: string[] }
   */
  static validateRow(
    row: Record<string, string>,
    rowNumber: number
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check name
    if (!row.name || !row.name.trim()) {
      errors.push(`Row ${rowNumber}: Name is required`);
    }

    // Check gender
    if (!row.gender || !row.gender.trim()) {
      errors.push(`Row ${rowNumber}: Gender is required`);
    } else if (!this.VALID_GENDERS.includes(row.gender.toLowerCase())) {
      errors.push(
        `Row ${rowNumber}: Invalid gender. Must be one of: ${this.VALID_GENDERS.join(', ')}`
      );
    }

    // Validate first_release_year if provided
    if (row.first_release_year && row.first_release_year.trim()) {
      const year = parseInt(row.first_release_year, 10);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        errors.push(`Row ${rowNumber}: Invalid first release year`);
      }
    }

    // Validate no_of_albums_released if provided
    if (row.no_of_albums_released && row.no_of_albums_released.trim()) {
      const albums = parseInt(row.no_of_albums_released, 10);
      if (isNaN(albums) || albums < 0) {
        errors.push(`Row ${rowNumber}: Number of albums must be non-negative`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
