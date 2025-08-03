import { useMutation } from "@tanstack/react-query";
import { User } from "@/types/api";
import { appPoster } from "../fetcher";
import {
  AUTH_PATH_LOGIN,
  AUTH_PATH_LOGOUT,
  AUTH_PATH_REGISTER,
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
  name: string;
  email: string;
  password: string;
}

// Login mutation
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await appPoster<LoginResponse>(AUTH_PATH_LOGIN, data);
    },
  });
};

// Register mutation
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return await appPoster<LoginResponse>(AUTH_PATH_REGISTER, data);
    },
  });
};

// Logout mutation
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      return await appPoster<void>(AUTH_PATH_LOGOUT);
    },
  });
};
