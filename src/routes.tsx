import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/components/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import RootLayout from "./components/layouts/RootLayout";

const DomainDetail = lazy(() => import("@/components/DomainDetail"));
const ProgramsPage = lazy(() => import("./pages/Programs"));
const CommunityPage = lazy(() => import("./pages/Community"));
const AboutMensaPage = lazy(() => import("./pages/AboutMensa"));
const VoicesOfMensaPage = lazy(() => import("./pages/VoicesOfMensa"));
const AboutUsPage = lazy(() => import("./pages/Aboutus"));
const JiraPage = lazy(() => import("./pages/Jira"));
const MinutesOfMeetingsPage = lazy(() => import("./pages/MinutesOfMeetings"));
const MinutesOfMeetingReadPage = lazy(
  () => import("./pages/MinutesOfMeetingRead"),
);
const PublicBlogReadPage = lazy(() => import("./pages/PublicBlogRead"));
const PublicDiscussionReadPage = lazy(() => import("./pages/PublicDiscussionRead"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const ProgressPage = lazy(() => import("./pages/Progress"));
const LearningPlans = lazy(() => import("./components/LearningPlan"));
const Error404Page = lazy(() => import("./components/common/Error404"));

// Auth pages
const LoginPage = lazy(() => import("./pages/auth/Login"));
const RegisterPage = lazy(() => import("./pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPassword"));

// Dashboard pages
const DashboardRedirect = lazy(() => import("./pages/dashboard/DashboardRedirect"));
const ParentOverview = lazy(() => import("./pages/dashboard/ParentOverview"));
const ChildDashboard = lazy(() => import("./pages/dashboard/ChildDashboard"));
const LearnerDetailPage = lazy(() => import("./pages/dashboard/LearnerDetailPage"));
const SubscriptionsPage = lazy(() => import("./pages/dashboard/SubscriptionsPage"));
const WritingBlogsPage = lazy(() => import("./pages/dashboard/WritingBlogsPage"));
const BlogDraftEditorPage = lazy(() => import("./pages/dashboard/BlogDraftEditorPage"));
const BlogReadPage = lazy(() => import("./pages/dashboard/BlogReadPage"));
const DiscussionPage = lazy(() => import("./pages/dashboard/DiscussionPage"));
const DiscussionTopicPage = lazy(() => import("./pages/dashboard/DiscussionTopicPage"));
const FeedbackPage = lazy(() => import("./pages/dashboard/FeedbackPage"));
const VoicesDraftPage = lazy(() => import("./pages/dashboard/VoicesDraftPage"));
const MinutesOfMeetingsDraftPage = lazy(
  () => import("./pages/dashboard/MinutesOfMeetingsDraftPage"),
);

const routeFallback = (
  <div className="min-h-[50vh] bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-[#24544c]">
    Loading...
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:topicId" element={<PublicDiscussionReadPage />} />
          <Route path="/about-mensa" element={<AboutMensaPage />} />
          <Route path="/voices-of-mensa" element={<VoicesOfMensaPage />} />
          <Route path="/jira" element={<JiraPage />} />
          <Route
            path="/minutes-of-meetings"
            element={<MinutesOfMeetingsPage />}
          />
          <Route
            path="/minutes-of-meetings/:minutesId"
            element={<MinutesOfMeetingReadPage />}
          />
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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
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
            <Route path="/dashboard/voices" element={<VoicesDraftPage />} />
            <Route
              path="/dashboard/minutes-of-meetings"
              element={<MinutesOfMeetingsDraftPage />}
            />
            <Route path="/dashboard/feedback" element={<FeedbackPage />} />
            <Route path="/dashboard/overview" element={<ParentOverview />} />
            <Route
              path="/dashboard/learners/:learnerId"
              element={<LearnerDetailPage />}
            />
            <Route
              path="/dashboard/subscriptions"
              element={<SubscriptionsPage />}
            />
            <Route path="/dashboard/child" element={<ChildDashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
