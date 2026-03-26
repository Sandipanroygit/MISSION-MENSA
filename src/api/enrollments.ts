import apiClient from "@/lib/axios";
import { ENROLLMENTS } from "@/constants/endpoints";
import type { CreateEnrollmentPayload, Enrollment } from "@/types/api";

export const enrollmentsApi = {
  list: async (learnerId?: string): Promise<Enrollment[]> => {
    const { data } = await apiClient.get<Enrollment[]>(ENROLLMENTS.BASE, {
      params: learnerId ? { learner_id: learnerId } : undefined,
    });
    return data;
  },

  create: async (payload: CreateEnrollmentPayload): Promise<Enrollment> => {
    const { data } = await apiClient.post<Enrollment>(
      ENROLLMENTS.BASE,
      payload,
    );
    return data;
  },
};
