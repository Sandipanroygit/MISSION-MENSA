import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enrollmentsApi } from "@/api/enrollments";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { CreateEnrollmentPayload } from "@/types/api";

export const useEnrollments = (learnerId?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.enrollments.list(learnerId),
    queryFn: () => enrollmentsApi.list(learnerId),
  });

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEnrollmentPayload) =>
      enrollmentsApi.create(payload),
    onSuccess: (_data, { learner_id }) => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.enrollments.list(learner_id),
      });
      // Also refresh learner dashboard since a new enrollment changes it
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.learners.dashboard(learner_id),
      });
    },
  });
};
