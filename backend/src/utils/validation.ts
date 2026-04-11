/**
 * Standardized error handling utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  code?: string;
}

export class ValidationError extends Error {
  public field: string;
  public code?: string;

  constructor(field: string, message: string, code?: string) {
    super(message);
    this.field = field;
    this.code = code;
    this.name = 'ValidationError';
  }
}

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string>;
  public code?: string;

  constructor(message: string, statusCode: number = 400, errors?: Record<string, string>, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    this.name = 'ApiError';
  }
}

export class ErrorHandler {
  /**
   * Handle validation errors and convert to standardized format
   */
  static handleValidationError(error: any): ApiError {
    if (error instanceof ValidationError) {
      return new ApiError(
        'Validation failed',
        400,
        { [error.field]: error.message },
        error.code
      );
    }

    if (error instanceof ApiError) {
      return error;
    }

    // Handle database constraint errors
    if (error.code === 'ER_DUP_ENTRY') {
      const match = error.message.match(/Duplicate entry '(.+)' for key '(.+)'/);
      if (match) {
        const [, value, key] = match;
        if (key.includes('email')) {
          return new ApiError(
            'Validation failed',
            400,
            { email: 'This email is already in use' }
          );
        }
        if (key.includes('phone')) {
          return new ApiError(
            'Validation failed',
            400,
            { phone: 'This phone number is already in use' }
          );
        }
      }
    }

    // Handle MySQL data truncation
    if (error.code === 'ER_DATA_TOO_LONG') {
      return new ApiError(
        'Validation failed',
        400,
        { general: 'One or more fields exceed maximum length' }
      );
    }

    // Default error
    return new ApiError(
      error.message || 'An unexpected error occurred',
      500
    );
  }

  /**
   * Send standardized error response
   */
  static sendErrorResponse(res: any, error: any) {
    const apiError = this.handleValidationError(error);

    res.status(apiError.statusCode).json({
      success: false,
      message: apiError.message,
      ...(apiError.errors && { errors: apiError.errors }),
      ...(apiError.code && { code: apiError.code })
    });
  }
}

/**
 * Validation utilities
 */
export class Validators {
  static email(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static phone(phone: string): boolean {
    // Allow digits, spaces, hyphens, parentheses, and plus sign
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    return phoneRegex.test(phone);
  }

  static password(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateName(name: string, fieldName: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push(`${fieldName} is required`);
    } else if (name.trim().length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    } else if (name.trim().length > 50) {
      errors.push(`${fieldName} must not exceed 50 characters`);
    } else if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static gender(gender: string): boolean {
    return ['male', 'female', 'other'].includes(gender.toLowerCase());
  }

  static dateOfBirth(dob: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const date = new Date(dob);
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format');
    } else {
      const age = new Date().getFullYear() - date.getFullYear();
      if (age < 13) {
        errors.push('Must be at least 13 years old');
      } else if (age > 120) {
        errors.push('Invalid date of birth');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static address(address: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (address && address.length > 255) {
      errors.push('Address must not exceed 255 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static albumName(albumName: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (albumName && albumName.length > 255) {
      errors.push('Album name must not exceed 255 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static songTitle(title: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Song title is required');
    } else if (title.trim().length < 1) {
      errors.push('Song title cannot be empty');
    } else if (title.trim().length > 255) {
      errors.push('Song title must not exceed 255 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static genre(genre: string): boolean {
    return ['rnb', 'country', 'classic', 'rock', 'jazz'].includes(genre.toLowerCase());
  }

  static firstReleaseYear(year: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (year < 1900) {
      errors.push('First release year must be 1900 or later');
    } else if (year > new Date().getFullYear()) {
      errors.push('First release year cannot be in the future');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static albumsReleased(count: number): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (count < 0) {
      errors.push('Number of albums released cannot be negative');
    } else if (count > 1000) {
      errors.push('Number of albums released seems unreasonably high');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}