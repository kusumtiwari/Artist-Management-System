
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  isAdmin: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  isAdmin?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface Artist {
  id: number;
  name: string;
  dob: Date | null;
  gender: 'male' | 'female' | 'other';
  address: string | null;
  first_release_year: number | null;
  no_of_albums_released: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateArtistData {
  name: string;
  dob?: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  first_release_year?: number;
  no_of_albums_released?: number;
}

export interface Song {
  id: number;
  artist_id: number;
  title: string;
  album_name: string | null;
  genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
  created_at: Date;
  updated_at: Date;
}

export interface CreateSongData {
  artist_id: number;
  title: string;
  album_name?: string;
  genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz';
}

export interface SongWithArtist extends Song {
  artist_name: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}