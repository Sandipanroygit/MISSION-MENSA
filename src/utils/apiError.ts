import { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

/**
 * Extracts a structured error from an unknown thrown value.
 * Laravel validation errors come as: { message, errors: { field: [msg, ...] } }
 */
export function getApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data as ApiError;
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong. Please try again." };
}

/**
 * Maps Laravel's nested errors object to a flat { field: firstMessage } record
 * so we can bind directly to form field state.
 */
export function mapFieldErrors(
  errors: Record<string, string[]>,
): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(errors).forEach(([field, msgs]) => {
    out[field] = msgs[0];
  });
  return out;
}
