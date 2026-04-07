import { api } from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { LoginPayload, SignupPayload, AuthResponse, User } from '../types/auth'

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, data)
    return res.data
  },

  signup: async (data: SignupPayload): Promise<AuthResponse> => {
    const res = await api.post(ENDPOINTS.AUTH.SIGNUP, data)
    return res.data
  },

  me: async (): Promise<User> => {
    const res = await api.get(ENDPOINTS.AUTH.ME)
    return res.data.user
  },

  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.AUTH.LOGOUT)
  },
}