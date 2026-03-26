import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/api/catalog";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type { WeeksParams } from "@/types/api";

export const useStages = () =>
  useQuery({
    queryKey: QUERY_KEYS.catalog.stages(),
    queryFn: catalogApi.getStages,
  });

export const useDomains = () =>
  useQuery({
    queryKey: QUERY_KEYS.catalog.domains(),
    queryFn: catalogApi.getDomains,
    // Domains rarely change — keep fresh for 15 min
    staleTime: 15 * 60 * 1000,
  });

export const useYearLevels = () =>
  useQuery({
    queryKey: QUERY_KEYS.catalog.yearLevels(),
    queryFn: catalogApi.getYearLevels,
    staleTime: 15 * 60 * 1000,
  });

export const useWeeks = (params?: WeeksParams) =>
  useQuery({
    queryKey: QUERY_KEYS.catalog.weeks(params),
    queryFn: () => catalogApi.getWeeks(params),
    enabled: Boolean(params?.domain_id || params?.year_level_id),
  });
