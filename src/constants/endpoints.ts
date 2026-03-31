// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AUTH = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  ME: "/api/me",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
} as const;

// ─── Catalog ─────────────────────────────────────────────────────────────────

export const CATALOG = {
  STAGES: "/api/catalog/stages",
  DOMAINS: "/api/catalog/domains",
  YEAR_LEVELS: "/api/catalog/year-levels",
  WEEKS: "/api/catalog/weeks",
} as const;

// ─── Learners ─────────────────────────────────────────────────────────────────

export const LEARNERS = {
  BASE: "/api/learners",
  CREATE: (householdId: string) => `/api/households/${householdId}/learners`,
  DETAIL: (id: string) => `/api/learners/${id}`,
  ROADMAP: (id: string) => `/api/learners/${id}/roadmap`,
  REPORT: (id: string) => `/api/learners/${id}/report`,
  DASHBOARD: (id: string) => `/api/learners/${id}/dashboard`,
  NEXT: (id: string) => `/api/learners/${id}/next`,
  LESSON_START: (learnerId: string, lessonId: string) =>
    `/api/learners/${learnerId}/lessons/${lessonId}/start`,
  LESSON_COMPLETE: (learnerId: string, lessonId: string) =>
    `/api/learners/${learnerId}/lessons/${lessonId}/complete`,
  ACTIVITY: (learnerId: string, activityId: string) =>
    `/api/learners/${learnerId}/activities/${activityId}`,
  ACTIVITY_SUBMIT: (learnerId: string, activityId: string) =>
    `/api/learners/${learnerId}/activities/${activityId}/submit`,
  ACTIVITY_SUBMISSIONS: (learnerId: string, activityId: string) =>
    `/api/learners/${learnerId}/activities/${activityId}/submissions`,
  ACTIVITY_SUBMISSION_APPROVE: (
    learnerId: string,
    activityId: string,
    submissionId: string,
  ) =>
    `/api/learners/${learnerId}/activities/${activityId}/submissions/${submissionId}/approve`,
  ACTIVITY_SUBMISSION_REJECT: (
    learnerId: string,
    activityId: string,
    submissionId: string,
  ) =>
    `/api/learners/${learnerId}/activities/${activityId}/submissions/${submissionId}/reject`,
  QUIZ: (learnerId: string, assessmentId: string) =>
    `/api/learners/${learnerId}/quiz/${assessmentId}`,
  QUIZ_ATTEMPT: (learnerId: string, assessmentId: string) =>
    `/api/learners/${learnerId}/quiz/${assessmentId}/attempt`,
} as const;

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const SUBSCRIPTIONS = {
  BASE: "/api/subscriptions",
  DOMAINS: (id: string) => `/api/subscriptions/${id}/domains`,
  ENTITLEMENTS: "/api/subscriptions/entitlements",
} as const;

// ─── Enrollments ─────────────────────────────────────────────────────────────

export const ENROLLMENTS = {
  BASE: "/api/enrollments",
} as const;

// ─── Named export bundle ──────────────────────────────────────────────────────

export const ENDPOINTS = {
  AUTH,
  CATALOG,
  LEARNERS,
  SUBSCRIPTIONS,
  ENROLLMENTS,
} as const;
