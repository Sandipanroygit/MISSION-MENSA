import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/components/Home";
import DomainDetail from "@/components/DomainDetail";
import ProgramsPage from "./pages/Programs";
import ResourcesPage from "./pages/Resources";
import CommunityPage from "./pages/Community";
import AboutUsPage from "./pages/Aboutus";
import ContactUs from "./pages/ContactUs";
import PricingPage from "./pages/Pricing";
import LearningPlans from "./components/LearningPlan";
import Error404Page from "./components/common/Error404";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import RootLayout from "./components/layouts/RootLayout";

// Auth pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public marketing routes — wrapped in Header + Footer ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route
          path="/domains-of-development/:domain"
          element={<DomainDetail />}
        />
        <Route path="/learning-plans" element={<LearningPlans />} />
      </Route>

      {/* ── Auth routes — no nav chrome (AuthLayout handles its own layout) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ── Protected dashboard routes ─────────────────────────────────────
           ProtectedRoute guards auth, DashboardLayout provides the nav/chrome.
           Add all authenticated pages as children of DashboardLayout below.
      ──────────────────────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Placeholder — replace with real dashboard page when ready */}
          <Route
            path="/dashboard"
            element={
              <div className="flex h-full items-center justify-center p-12 text-gray-400">
                Dashboard coming soon
              </div>
            }
          />
          {/* Add more dashboard child routes here, e.g.: */}
          {/* <Route path="/dashboard/learners" element={<LearnersPage />} /> */}
          {/* <Route path="/dashboard/progress" element={<ProgressPage />} /> */}
          {/* <Route path="/dashboard/settings" element={<SettingsPage />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default AppRoutes;
