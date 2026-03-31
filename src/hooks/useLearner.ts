import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { learnersApi } from "@/api/learners";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  CreateLearnerPayload,
  QuizAttemptPayload,
  SubmitActivityPayload,
  UpdateLearnerPayload,
} from "@/types/api";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useLearner = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.detail(id),
    queryFn: () => learnersApi.get(id),
    enabled: Boolean(id),
  });

export const useLearnerDashboard = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.dashboard(id),
    queryFn: () => learnersApi.getDashboard(id),
    enabled: Boolean(id),
  });

export const useLearnerRoadmap = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.roadmap(id),
    queryFn: () => learnersApi.getRoadmap(id),
    enabled: Boolean(id),
  });

export const useLearnerReport = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.report(id),
    queryFn: () => learnersApi.getReport(id),
    enabled: Boolean(id),
  });

export const useLearnerNext = (id: string, domainId?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.next(id, domainId),
    queryFn: () => learnersApi.getNext(id, domainId),
    enabled: Boolean(id),
  });

export const useLearnerActivity = (learnerId: string, activityId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.activity(learnerId, activityId),
    queryFn: () => learnersApi.getActivity(learnerId, activityId),
    enabled: Boolean(learnerId) && Boolean(activityId),
  });

export const useLearnerSubmissions = (learnerId: string, activityId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.submissions(learnerId, activityId),
    queryFn: () => learnersApi.getSubmissions(learnerId, activityId),
    enabled: Boolean(learnerId) && Boolean(activityId),
  });

export const useQuiz = (learnerId: string, assessmentId: string) =>
  useQuery({
    queryKey: QUERY_KEYS.learners.quiz(learnerId, assessmentId),
    queryFn: () => learnersApi.getQuiz(learnerId, assessmentId),
    enabled: Boolean(learnerId) && Boolean(assessmentId),
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateLearner = (householdId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLearnerPayload) =>
      learnersApi.create(householdId, payload),
    onSuccess: () => {
      // Invalidate /me so the household learners list refreshes
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useUpdateLearner = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLearnerPayload) =>
      learnersApi.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.detail(id),
      });
    },
  });
};

export const useStartLesson = () =>
  useMutation({
    mutationFn: ({
      learnerId,
      lessonId,
    }: {
      learnerId: string;
      lessonId: string;
    }) => learnersApi.startLesson(learnerId, lessonId),
  });

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      learnerId,
      lessonId,
    }: {
      learnerId: string;
      lessonId: string;
    }) => learnersApi.completeLesson(learnerId, lessonId),
    onSuccess: (_data, { learnerId }) => {
      // Refresh dashboard and next-item after lesson completion
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.dashboard(learnerId),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.next(learnerId),
      });
    },
  });
};

export const useSubmitActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      learnerId,
      activityId,
      payload,
    }: {
      learnerId: string;
      activityId: string;
      payload: SubmitActivityPayload;
    }) => learnersApi.submitActivity(learnerId, activityId, payload),
    onSuccess: (_data, { learnerId, activityId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.submissions(learnerId, activityId),
      });
    },
  });
};

export const useApproveSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      learnerId,
      activityId,
      submissionId,
    }: {
      learnerId: string;
      activityId: string;
      submissionId: string;
    }) => learnersApi.approveSubmission(learnerId, activityId, submissionId),
    onSuccess: (_data, { learnerId, activityId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.submissions(learnerId, activityId),
      });
    },
  });
};

export const useRejectSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      learnerId,
      activityId,
      submissionId,
      feedback,
    }: {
      learnerId: string;
      activityId: string;
      submissionId: string;
      feedback?: string;
    }) =>
      learnersApi.rejectSubmission(
        learnerId,
        activityId,
        submissionId,
        feedback,
      ),
    onSuccess: (_data, { learnerId, activityId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.submissions(learnerId, activityId),
      });
    },
  });
};

export const useAttemptQuiz = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      learnerId,
      assessmentId,
      payload,
    }: {
      learnerId: string;
      assessmentId: string;
      payload: QuizAttemptPayload;
    }) => learnersApi.attemptQuiz(learnerId, assessmentId, payload),
    onSuccess: (_data, { learnerId }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.dashboard(learnerId),
      });
    },
  });
};
