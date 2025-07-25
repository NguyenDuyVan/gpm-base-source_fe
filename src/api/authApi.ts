import { fetchApi } from "./apiClient";
import { User } from "@/types/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    return fetchApi<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    return fetchApi<void>("/auth/logout", {
      method: "POST",
      requireAuth: true,
    });
  },

  me: async (): Promise<User> => {
    return fetchApi<User>("/auth/me", {
      requireAuth: true,
    });
  },
};
