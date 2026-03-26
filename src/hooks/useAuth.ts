import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { getToken, removeToken } from "@/lib/axios";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/api";

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Fetch the authenticated user's profile, roles, and households. */
export const useMe = () =>
  useQuery({
    queryKey: QUERY_KEYS.auth.me(),
    queryFn: authApi.me,
    // Only run when a token is present — avoids 401 on initial load
    enabled: Boolean(getToken()),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      // Pre-populate the /me cache after registration
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me() });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear token and entire cache regardless of server response
      removeToken();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      authApi.forgotPassword(payload),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authApi.resetPassword(payload),
  });
