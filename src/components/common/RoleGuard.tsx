import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import type { RoleName } from "@/types/api";

interface Props {
  /** One or more roles — user must have AT LEAST ONE to pass */
  roles: RoleName[];
  /** Where to redirect if the role check fails. Defaults to "/" */
  redirectTo?: string;
  /** Optional child content (when not used as a layout route wrapper) */
  children?: React.ReactNode;
}

/**
 * Restricts access to users that hold at least one of the specified roles.
 * Must be used inside a <ProtectedRoute> (i.e. user is already authenticated).
 *
 * As a layout route (recommended):
 *   <Route element={<RoleGuard roles={["PARENT"]} />}>
 *     <Route path="/parent/dashboard" element={<ParentDashboard />} />
 *   </Route>
 *
 * As an inline wrapper:
 *   <RoleGuard roles={["SUPER_ADMIN"]} redirectTo="/dashboard">
 *     <AdminPanel />
 *   </RoleGuard>
 */
export default function RoleGuard({
  roles,
  redirectTo = "/",
  children,
}: Props) {
  const { hasRole } = useAuthContext();

  if (!hasRole(...roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
