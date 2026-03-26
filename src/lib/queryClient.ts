import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

/** Do not retry on any 4xx client error — only retry on 5xx / network failures */
const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    if (status >= 400 && status < 500) return false;
  }
  return failureCount < 2;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — data is fresh
      gcTime: 10 * 60 * 1000, // 10 min — keep in cache after unmount
      retry: shouldRetry,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
