import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

interface Props {
  /** Where to send unauthenticated users. Defaults to /login */
  redirectTo?: string;
}

/**
 * Wrap any set of routes that require a logged-in user.
 *
 * Usage in routes.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * While the /me request is in-flight the user sees a full-screen
 * spinner so there is never a flash of the login redirect.
 */
export default function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// ─── Full-screen loading state ────────────────────────────────────────────────

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2CA4A4] border-t-transparent" />
        <p className="text-sm text-gray-500">Loading…</p>
      </div>
    </div>
  );
}
