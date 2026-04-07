import { Routes, Route } from "react-router-dom";
import Home from "@/components/Home";
import DomainDetail from "@/components/DomainDetail";
import ProgramsPage from "./pages/Programs";
import CommunityPage from "./pages/Community";
import AboutUsPage from "./pages/Aboutus";
import PublicBlogReadPage from "./pages/PublicBlogRead";
import PublicDiscussionReadPage from "./pages/PublicDiscussionRead";
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
import SubscriptionsPage from "./pages/dashboard/SubscriptionsPage";
import WritingBlogsPage from "./pages/dashboard/WritingBlogsPage";
import BlogDraftEditorPage from "./pages/dashboard/BlogDraftEditorPage";
import BlogReadPage from "./pages/dashboard/BlogReadPage";
import DiscussionPage from "./pages/dashboard/DiscussionPage";
import DiscussionTopicPage from "./pages/dashboard/DiscussionTopicPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public marketing routes — wrapped in Header + Footer ── */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:topicId" element={<PublicDiscussionReadPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/about-us/:slug" element={<PublicBlogReadPage />} />
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
          <Route
            path="/dashboard/writing-blogs"
            element={<WritingBlogsPage />}
          />
          <Route
            path="/dashboard/writing-blogs/new"
            element={<BlogDraftEditorPage />}
          />
          <Route
            path="/dashboard/writing-blogs/read/:slug"
            element={<BlogReadPage />}
          />
          <Route path="/dashboard/discussion" element={<DiscussionPage />} />
          <Route
            path="/dashboard/discussion/:topicId"
            element={<DiscussionTopicPage />}
          />
          <Route path="/dashboard/overview" element={<ParentOverview />} />
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
