import type { User } from './auth'

export interface PaginatedList<T> {
  users: T[]
  artists: T[]
  total: number
  page: number
  pageSize: number
}

export interface Artist {
  id: number
  name: string
  genre: string
  email?: string
  phone?: string
  status?: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export type UsersResponse = PaginatedList<User>
export type ArtistsResponse = PaginatedList<Artist>

export interface CreateUserPayload {
  first_name: string
  last_name: string
  email: string
  phone?: string
}

export interface CreateArtistPayload {
  name: string
  genre: string
  email?: string
  status?: 'active' | 'inactive'
}
