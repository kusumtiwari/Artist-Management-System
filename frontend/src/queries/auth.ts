import { useMutation, useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth'
import type { LoginPayload, SignupPayload, AuthResponse } from '../types/auth'

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authService.login,
  })
}

export const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: authService.signup,
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
    retry: false,
    staleTime: Infinity,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
  })
}