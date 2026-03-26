import { Outlet } from "react-router-dom";
import DashboardHeader from "@/components/UI/DashboardHeader";

/**
 * Layout for all authenticated dashboard routes.
 * Uses DashboardHeader (no public footer).
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2]">
      <DashboardHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
