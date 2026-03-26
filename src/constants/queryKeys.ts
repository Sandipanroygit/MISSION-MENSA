import type { WeeksParams } from "@/types/api";

/**
 * Centralised query key factory.
 * Using arrays keeps invalidation surgical — e.g. invalidating
 * ['learners', id] auto-invalidates every sub-key under that learner.
 */
export const QUERY_KEYS = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  auth: {
    all: ["auth"] as const,
    me: () => ["auth", "me"] as const,
  },

  // ── Catalog ─────────────────────────────────────────────────────────────────
  catalog: {
    all: ["catalog"] as const,
    stages: () => ["catalog", "stages"] as const,
    domains: () => ["catalog", "domains"] as const,
    yearLevels: () => ["catalog", "year-levels"] as const,
    weeks: (params?: WeeksParams) =>
      ["catalog", "weeks", params ?? {}] as const,
  },

  // ── Learners ─────────────────────────────────────────────────────────────────
  learners: {
    all: ["learners"] as const,
    detail: (id: string) => ["learners", id] as const,
    roadmap: (id: string) => ["learners", id, "roadmap"] as const,
    report: (id: string) => ["learners", id, "report"] as const,
    dashboard: (id: string) => ["learners", id, "dashboard"] as const,
    next: (id: string, domainId?: string) =>
      ["learners", id, "next", domainId ?? null] as const,
    activity: (learnerId: string, activityId: string) =>
      ["learners", learnerId, "activities", activityId] as const,
    submissions: (learnerId: string, activityId: string) =>
      ["learners", learnerId, "activities", activityId, "submissions"] as const,
    quiz: (learnerId: string, assessmentId: string) =>
      ["learners", learnerId, "quiz", assessmentId] as const,
  },

  // ── Subscriptions ────────────────────────────────────────────────────────────
  subscriptions: {
    all: ["subscriptions"] as const,
    list: () => ["subscriptions", "list"] as const,
    entitlements: () => ["subscriptions", "entitlements"] as const,
  },

  // ── Enrollments ──────────────────────────────────────────────────────────────
  enrollments: {
    all: ["enrollments"] as const,
    list: (learnerId?: string) =>
      ["enrollments", "list", learnerId ?? null] as const,
  },
} as const;
