import { Routes, Route } from "react-router-dom";
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

// Dashboard pages
import DashboardRedirect from "./pages/dashboard/DashboardRedirect";
import ParentOverview from "./pages/dashboard/ParentOverview";
import ChildDashboard from "./pages/dashboard/ChildDashboard";
import LearnerDetailPage from "./pages/dashboard/LearnerDetailPage";
import LearnerManagementPage from "./pages/dashboard/LearnerManagementPage";
import SubscriptionsPage from "./pages/dashboard/SubscriptionsPage";

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

      {/* ── Auth routes — no nav chrome ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ── Protected dashboard routes ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Role-aware redirect at /dashboard root */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Parent views */}
          <Route path="/dashboard/overview" element={<ParentOverview />} />
          <Route
            path="/dashboard/learners"
            element={<LearnerManagementPage />}
          />
          <Route
            path="/dashboard/learners/:learnerId"
            element={<LearnerDetailPage />}
          />
          <Route
            path="/dashboard/subscriptions"
            element={<SubscriptionsPage />}
          />

          {/* Child view */}
          <Route path="/dashboard/child" element={<ChildDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default AppRoutes;
