export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  username: string
  email: string
  password: string
}

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  dob?: string
  gender?: 'm' | 'f' | 'o'
  address?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user: User
}