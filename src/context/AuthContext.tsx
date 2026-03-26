import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getToken } from "@/lib/axios";
import { useMe } from "@/hooks/useAuth";
import type { Household, Learner, Role, RoleName, User } from "@/types/api";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  /** Authenticated user, or null when logged out */
  user: User | null;
  /** All roles assigned to the user */
  roles: Role[];
  /** Households the user belongs to */
  households: Household[];
  /** Flat list of all learners across every household */
  learners: Learner[];
  /** True while the /me request is in-flight (only when token exists) */
  isLoading: boolean;
  /** True once /me resolves successfully */
  isAuthenticated: boolean;
  /** Returns true if the user has at least one of the given roles */
  hasRole: (...roles: RoleName[]) => boolean;
  isParent: boolean;
  isChild: boolean;
  isAdmin: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  // useMe is the single server-side source of truth.
  // It only fires when a token is present (see useAuth.ts).
  const { data, isLoading: queryLoading } = useMe();

  const value = useMemo<AuthContextValue>(() => {
    const user = data?.user ?? null;
    const roles = data?.roles ?? [];
    const households = data?.households ?? [];
    const roleNames = new Set(roles.map((r) => r.name));

    return {
      user,
      roles,
      households,
      learners: households.flatMap((h) => h.learners),
      // Only show a loading state when there is actually a token to validate.
      // Without this guard, logged-out users would see a spinner indefinitely.
      isLoading: queryLoading && Boolean(getToken()),
      isAuthenticated: Boolean(user),
      hasRole: (...requested: RoleName[]) =>
        requested.some((r) => roleNames.has(r)),
      isParent: roleNames.has("PARENT"),
      isChild: roleNames.has("CHILD"),
      isAdmin: roleNames.has("SUPER_ADMIN") || roleNames.has("OPS_ADMIN"),
    };
  }, [data, queryLoading]);
  console.log("AuthContext value:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
