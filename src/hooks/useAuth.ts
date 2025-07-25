import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { queryClient } from "@/utils/queryClient";

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.token);
      // Invalidate any authenticated queries that might depend on the user
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useRegister() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      login(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      // Clear all queries when the user logs out
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    // Skip the query if the user isn't authenticated
    enabled: isAuthenticated,
  });
}
