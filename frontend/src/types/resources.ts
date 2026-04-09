import type { User } from './auth'

export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface UsersResponse {
  success: boolean
  users: User[]
  pagination: Pagination
}

export interface ArtistsResponse {
  success: boolean
  artists: Artist[]
  pagination: Pagination
}

export interface Artist {
  id: number
  name: string
  dob: string | null
  gender: 'male' | 'female' | 'other'
  address: string | null
  first_release_year: number | null
  no_of_albums_released: number
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  first_name: string
  last_name: string
  email: string
  phone?: string
}

export interface CreateArtistPayload {
  name: string
  dob?: string
  gender?: 'male' | 'female' | 'other'
  address?: string
  first_release_year?: number
  no_of_albums_released?: number
}

export interface Song {
  id: number
  title: string
  artist_id: number
  album_name?: string | null
  genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz'
  created_at: string
  updated_at: string
}

export interface SongWithArtist extends Song {
  artist?: Artist
}

export interface SongsResponse {
  success: boolean
  songs: SongWithArtist[]
  pagination: Pagination
}

export interface CreateSongPayload {
  title: string
  artist_id: number
  album_name?: string
  genre: 'rnb' | 'country' | 'classic' | 'rock' | 'jazz'
}

export interface UpdateSongPayload extends Partial<CreateSongPayload> {
  id: number
}