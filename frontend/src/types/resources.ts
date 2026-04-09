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
  genre: string
  email?: string
  phone?: string
  status?: 'active' | 'inactive'
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
  genre: string
  email?: string
  status?: 'active' | 'inactive'
}