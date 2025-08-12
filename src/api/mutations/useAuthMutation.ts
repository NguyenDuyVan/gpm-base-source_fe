import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/api";
import { appPoster } from "../fetcher";
import {
  AUTH_PATH_LOGIN,
  AUTH_PATH_LOGOUT,
  AUTH_PATH_REGISTER,
  AUTH_PATH_SOCIAL_LOGIN,
  AUTH_PATH_FORGOT_PASSWORD,
  AUTH_PATH_RESET_PASSWORD,
} from "../apiPaths";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  address?: string;
  phoneNumber?: string;
  taxCode?: string;
}

interface SocialLoginRequest {
  idToken: string;
  provider: "google" | "facebook";
  uid: string;
  email: string;
  fullName: string;
  photoURL?: string;
}

// Login mutation
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await appPoster<LoginResponse>(AUTH_PATH_LOGIN, data);
    },
    retry: false,
  });
};

// Register mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return await appPoster<LoginResponse>(AUTH_PATH_REGISTER, data);
    },
    retry: false,
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      return await appPoster<void>(AUTH_PATH_LOGOUT);
    },
    retry: false,
  });
};

// Social login mutation
export const useSocialLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: SocialLoginRequest) => {
      return await appPoster<LoginResponse>(AUTH_PATH_SOCIAL_LOGIN, data);
    },
    retry: false,
  });
};

// Forgot password mutation
interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      return await appPoster<ForgotPasswordResponse>(
        AUTH_PATH_FORGOT_PASSWORD,
        data
      );
    },
    retry: false,
  });
};

// Reset password mutation
interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      return await appPoster<ResetPasswordResponse>(
        AUTH_PATH_RESET_PASSWORD,
        data
      );
    },
    retry: false,
  });
};
