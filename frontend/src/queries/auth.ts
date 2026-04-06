import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth";
import type { LoginPayload, SignupPayload, AuthResponse } from "../types/auth";

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authService.login,
  });
};

export const useSignup = () => {
  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: authService.signup,
  });
};