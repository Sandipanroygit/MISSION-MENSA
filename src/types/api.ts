// ─── Shared ───────────────────────────────────────────────────────────────────

/** Laravel paginated response envelope */
export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RoleName =
  | "SUPER_ADMIN"
  | "CONTENT_ADMIN"
  | "OPS_ADMIN"
  | "PARENT"
  | "CHILD";

export type RoleScopeType = "platform" | "household" | "school";

export interface Role {
  name: RoleName;
  scope_type: RoleScopeType;
  scope_id: string;
}

export interface Learner {
  id: string; // UUID
  name: string;
  date_of_birth?: string;
  year_level_id?: string;
  household_id: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string; // UUID
  name: string;
  learners: Learner[];
}

export interface MeResponse {
  user: User;
  roles: Role[];
  households: Household[];
}

export interface AuthTokenResponse {
  access_token: string;
  user: User;
}

// ─── Auth Request Payloads ────────────────────────────────────────────────────

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  household_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ─── Catalog ─────────────────────────────────────────────────────────────────

export interface Stage {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

export interface Domain {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface YearLevel {
  id: string;
  name: string;
  stage_id: string;
  order?: number;
}

export type WeekStatus = "locked" | "available" | "in_progress" | "completed";

export interface Week {
  id: string;
  title: string;
  description?: string;
  domain_id: string;
  year_level_id: string;
  order: number;
  status: WeekStatus;
}

export interface WeeksParams {
  domain_id?: string;
  year_level_id?: string;
}

// ─── Learner (Parent CRUD) ────────────────────────────────────────────────────

export interface CreateLearnerPayload {
  name: string;
  date_of_birth?: string;
  year_level_id?: string;
}

export interface UpdateLearnerPayload {
  name?: string;
  date_of_birth?: string;
  year_level_id?: string;
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

export interface Subscription {
  id: string;
  household_id: string;
  plan?: string;
  status?: string;
  domains?: Domain[];
  started_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionPayload {
  plan?: string;
  [key: string]: unknown;
}

export interface SetSubscriptionDomainsPayload {
  domain_ids: string[];
}

export interface Entitlements {
  domains: string[];
  [key: string]: unknown;
}

// ─── Enrollments ─────────────────────────────────────────────────────────────

export interface Enrollment {
  id: string;
  learner_id: string;
  domain_id: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEnrollmentPayload {
  learner_id: string;
  domain_id: string;
}

// ─── Learner Dashboard / Progress ────────────────────────────────────────────

export interface LearnerDashboard {
  learner: Learner;
  enrollments: Enrollment[];
  recent_activity?: unknown;
  [key: string]: unknown;
}

export interface LearnerRoadmap {
  learner: Learner;
  domains: Array<{
    domain: Domain;
    weeks: Week[];
  }>;
}

export interface LearnerReport {
  learner: Learner;
  [key: string]: unknown;
}

export interface NextItem {
  type: "lesson" | "quiz" | "activity";
  id: string;
  title: string;
  domain_id: string;
  [key: string]: unknown;
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export interface LessonProgressResponse {
  lesson_id: string;
  learner_id: string;
  status: string;
  started_at?: string;
  completed_at?: string;
}

// ─── Activities / Submissions ─────────────────────────────────────────────────

export interface PracticalActivity {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  [key: string]: unknown;
}

export interface Submission {
  id: string;
  learner_id: string;
  practical_activity_id: string;
  content?: string;
  file_url?: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface SubmitActivityPayload {
  content?: string;
  file?: File;
  [key: string]: unknown;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export type QuestionType = "multiple_choice" | "true_false" | "fill_in";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttemptPayload {
  answers: Record<string, string>;
}

export interface QuizAttemptResult {
  score: number;
  total: number;
  passed: boolean;
  results: Array<{
    question_id: string;
    correct: boolean;
    correct_answer?: string;
  }>;
}
