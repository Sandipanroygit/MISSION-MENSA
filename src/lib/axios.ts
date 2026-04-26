import axios, { AxiosError } from "axios";

// ─── Token helpers ────────────────────────────────────────────────────────────

const TOKEN_KEY = "finwit_kids_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);

export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = (): boolean => Boolean(getToken());

// ─── Axios instance ───────────────────────────────────────────────────────────

const apiClient = axios.create({
  // Use same-origin API routes (e.g. /api/auth/login) without external backend base URL.
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // token-based auth, not session cookies
});

// ─── Request interceptor — attach Bearer token ────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 ───────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      // Avoid redirect loop on the login page itself
      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
