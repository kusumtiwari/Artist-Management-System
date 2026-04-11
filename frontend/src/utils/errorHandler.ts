/**
 * Frontend error handling utilities
 */

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
  code?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export class FrontendErrorHandler {
  /**
   * Extract field errors from API error response
   */
  static extractFieldErrors(error: any): FormErrors {
    if (error?.response?.data?.errors) {
      return error.response.data.errors;
    }

    // Handle axios error format
    if (error?.response?.data?.message) {
      // Try to parse if it's a validation error message
      const message = error.response.data.message;
      if (message.includes('already in use') || message.includes('already exists')) {
        return { email: message };
      }
      if (message.includes('Invalid credentials')) {
        return { email: 'Invalid email or password', password: 'Invalid email or password' };
      }
    }

    return {};
  }

  /**
   * Get general error message from API error
   */
  static getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: any): boolean {
    return !!(error?.response?.data?.errors || error?.response?.data?.message);
  }
}