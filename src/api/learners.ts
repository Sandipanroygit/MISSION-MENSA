import apiClient from "@/lib/axios";
import { LEARNERS } from "@/constants/endpoints";
import type {
  CreateLearnerPayload,
  Learner,
  LearnerDashboard,
  LearnerReport,
  LearnerRoadmap,
  LessonProgressResponse,
  NextItem,
  PracticalActivity,
  Quiz,
  QuizAttemptPayload,
  QuizAttemptResult,
  Submission,
  SubmitActivityPayload,
  UpdateLearnerPayload,
} from "@/types/api";

export const learnersApi = {
  // ── Parent CRUD ─────────────────────────────────────────────────────────────

  create: async (payload: CreateLearnerPayload): Promise<Learner> => {
    const { data } = await apiClient.post<Learner>(LEARNERS.BASE, payload);
    return data;
  },

  get: async (id: string): Promise<Learner> => {
    const { data } = await apiClient.get<Learner>(LEARNERS.DETAIL(id));
    return data;
  },

  update: async (
    id: string,
    payload: UpdateLearnerPayload,
  ): Promise<Learner> => {
    const { data } = await apiClient.put<Learner>(LEARNERS.DETAIL(id), payload);
    return data;
  },

  // ── Parent reporting ─────────────────────────────────────────────────────────

  getRoadmap: async (id: string): Promise<LearnerRoadmap> => {
    const { data } = await apiClient.get<LearnerRoadmap>(LEARNERS.ROADMAP(id));
    return data;
  },

  getReport: async (id: string): Promise<LearnerReport> => {
    const { data } = await apiClient.get<LearnerReport>(LEARNERS.REPORT(id));
    return data;
  },

  // ── Child learning ───────────────────────────────────────────────────────────

  getDashboard: async (id: string): Promise<LearnerDashboard> => {
    const { data } = await apiClient.get<LearnerDashboard>(
      LEARNERS.DASHBOARD(id),
    );
    return data;
  },

  getNext: async (id: string, domainId?: string): Promise<NextItem> => {
    const { data } = await apiClient.get<NextItem>(LEARNERS.NEXT(id), {
      params: domainId ? { domain_id: domainId } : undefined,
    });
    return data;
  },

  startLesson: async (
    learnerId: string,
    lessonId: string,
  ): Promise<LessonProgressResponse> => {
    const { data } = await apiClient.post<LessonProgressResponse>(
      LEARNERS.LESSON_START(learnerId, lessonId),
    );
    return data;
  },

  completeLesson: async (
    learnerId: string,
    lessonId: string,
  ): Promise<LessonProgressResponse> => {
    const { data } = await apiClient.post<LessonProgressResponse>(
      LEARNERS.LESSON_COMPLETE(learnerId, lessonId),
    );
    return data;
  },

  // ── Activities ───────────────────────────────────────────────────────────────

  getActivity: async (
    learnerId: string,
    activityId: string,
  ): Promise<PracticalActivity> => {
    const { data } = await apiClient.get<PracticalActivity>(
      LEARNERS.ACTIVITY(learnerId, activityId),
    );
    return data;
  },

  submitActivity: async (
    learnerId: string,
    activityId: string,
    payload: SubmitActivityPayload,
  ): Promise<Submission> => {
    // Use multipart/form-data when a file is included
    const hasFile = payload.file instanceof File;
    const config = hasFile
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined;
    const body = hasFile ? buildFormData(payload) : payload;
    const { data } = await apiClient.post<Submission>(
      LEARNERS.ACTIVITY_SUBMIT(learnerId, activityId),
      body,
      config,
    );
    return data;
  },

  // ── Submissions (parent) ─────────────────────────────────────────────────────

  getSubmissions: async (
    learnerId: string,
    activityId: string,
  ): Promise<Submission[]> => {
    const { data } = await apiClient.get<Submission[]>(
      LEARNERS.ACTIVITY_SUBMISSIONS(learnerId, activityId),
    );
    return data;
  },

  approveSubmission: async (
    learnerId: string,
    activityId: string,
    submissionId: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.post<Submission>(
      LEARNERS.ACTIVITY_SUBMISSION_APPROVE(learnerId, activityId, submissionId),
    );
    return data;
  },

  rejectSubmission: async (
    learnerId: string,
    activityId: string,
    submissionId: string,
    feedback?: string,
  ): Promise<Submission> => {
    const { data } = await apiClient.post<Submission>(
      LEARNERS.ACTIVITY_SUBMISSION_REJECT(learnerId, activityId, submissionId),
      feedback ? { feedback } : undefined,
    );
    return data;
  },

  // ── Quiz ─────────────────────────────────────────────────────────────────────

  getQuiz: async (learnerId: string, assessmentId: string): Promise<Quiz> => {
    const { data } = await apiClient.get<Quiz>(
      LEARNERS.QUIZ(learnerId, assessmentId),
    );
    return data;
  },

  attemptQuiz: async (
    learnerId: string,
    assessmentId: string,
    payload: QuizAttemptPayload,
  ): Promise<QuizAttemptResult> => {
    const { data } = await apiClient.post<QuizAttemptResult>(
      LEARNERS.QUIZ_ATTEMPT(learnerId, assessmentId),
      payload,
    );
    return data;
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildFormData(payload: SubmitActivityPayload): FormData {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, value as string | Blob);
    }
  });
  return form;
}
