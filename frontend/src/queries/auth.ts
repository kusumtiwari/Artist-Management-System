import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth";
import { useToast } from "../components/ui/toast";
import { FrontendErrorHandler } from "../utils/errorHandler";
import type { LoginPayload, SignupPayload, AuthResponse } from "../types/auth";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { showToast } = useToast();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: authService.login,
    onSuccess: () => {
      showToast("Logged in successfully", "success");
    },
    onError: (error) => {
      const fieldErrors = FrontendErrorHandler.extractFieldErrors(error);
      const generalError = FrontendErrorHandler.getErrorMessage(error);

      if (Object.keys(fieldErrors).length > 0) {
        // Field errors will be handled by the form
        return;
      }

      showToast(generalError, "error");
    },
  });
};

export const useSignup = () => {
  const { showToast } = useToast();

  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: authService.signup,
    onSuccess: () => {
      showToast("Account created successfully", "success");
    },
    onError: (error) => {
      const fieldErrors = FrontendErrorHandler.extractFieldErrors(error);
      const generalError = FrontendErrorHandler.getErrorMessage(error);

      if (Object.keys(fieldErrors).length > 0) {
        // Field errors will be handled by the form
        return;
      }

      showToast(generalError, "error");
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: authService.me,
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      console.log("running loginnnnn ");
      queryClient.clear();
      navigate("/login");
    },
  });
};
