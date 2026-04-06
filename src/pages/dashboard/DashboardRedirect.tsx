import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Redirects to the correct dashboard view based on the user's role.
 * - PARENT / admin → /dashboard/overview
 * - CHILD           → /dashboard/child
 */
export default function DashboardRedirect() {
  const { isParent, isChild, isAdmin, isLoading, isAuthenticated } =
    useAuthContext();
  console.log(
    { isParent, isChild, isAdmin, isLoading, isAuthenticated },
    "dash redirect",
  );
  // Wait until the /me query has resolved AND a role has been determined.
  // ProtectedRoute already blocks on isLoading, but isLoading becomes false
  // before this component renders, so we re-check here to guard against an
  // authenticated user whose roles array is transiently empty.
  const rolesResolved = isAuthenticated && (isParent || isChild || isAdmin);

  if (isLoading || !rolesResolved) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2CA4A4] border-t-transparent" />
      </div>
    );
  }

  if (isChild && !isParent && !isAdmin) {
    return <Navigate to="/dashboard/child" replace />;
  }

  return <Navigate to="/dashboard/writing-blogs" replace />;
}
