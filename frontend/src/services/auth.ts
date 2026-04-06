// src/services/auth.service.ts
import { api } from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import type { LoginPayload, SignupPayload, AuthResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },

  signup: async (data: SignupPayload): Promise<AuthResponse> => {
    const res = await api.post(ENDPOINTS.AUTH.SIGNUP, data);
    return res.data;
  },
};