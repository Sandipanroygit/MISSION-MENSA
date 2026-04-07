import apiClient, { setToken } from "@/lib/axios";
import { AUTH } from "@/constants/endpoints";
import type {
  AuthTokenResponse,
  ForgotPasswordPayload,
  LoginPayload,
  MeResponse,
  RegisterPayload,
  ResetPasswordPayload,
} from "@/types/api";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthTokenResponse> => {
    const { data } = await apiClient.post<AuthTokenResponse>(
      AUTH.REGISTER,
      payload,
    );
    setToken(data.access_token);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthTokenResponse> => {
    const { data } = await apiClient.post<AuthTokenResponse>(
      AUTH.LOGIN,
      payload,
    );
    if (!data.access_token) {
      throw new Error("Email or password is incorrect.");
    }
    setToken(data.access_token);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(AUTH.LOGOUT);
  },

  me: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get<MeResponse>(AUTH.ME);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload): Promise<void> => {
    await apiClient.post(AUTH.FORGOT_PASSWORD, payload);
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<void> => {
    await apiClient.post(AUTH.RESET_PASSWORD, payload);
  },
};
