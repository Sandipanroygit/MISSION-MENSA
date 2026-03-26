import apiClient from "@/lib/axios";
import { CATALOG } from "@/constants/endpoints";
import type { Domain, Stage, Week, WeeksParams, YearLevel } from "@/types/api";

export const catalogApi = {
  getStages: async (): Promise<Stage[]> => {
    const { data } = await apiClient.get<Stage[]>(CATALOG.STAGES);
    return data;
  },

  getDomains: async (): Promise<Domain[]> => {
    const { data } = await apiClient.get<Domain[]>(CATALOG.DOMAINS);
    return data;
  },

  getYearLevels: async (): Promise<YearLevel[]> => {
    const { data } = await apiClient.get<YearLevel[]>(CATALOG.YEAR_LEVELS);
    return data;
  },

  getWeeks: async (params?: WeeksParams): Promise<Week[]> => {
    const { data } = await apiClient.get<Week[]>(CATALOG.WEEKS, {
      params,
    });
    return data;
  },
};
