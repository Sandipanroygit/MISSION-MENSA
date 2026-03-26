import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionsApi } from "@/api/subscriptions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import type {
  CreateSubscriptionPayload,
  SetSubscriptionDomainsPayload,
} from "@/types/api";

export const useSubscriptions = () =>
  useQuery({
    queryKey: QUERY_KEYS.subscriptions.list(),
    queryFn: subscriptionsApi.list,
  });

export const useEntitlements = () =>
  useQuery({
    queryKey: QUERY_KEYS.subscriptions.entitlements(),
    queryFn: subscriptionsApi.getEntitlements,
  });

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSubscriptionPayload) =>
      subscriptionsApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.subscriptions.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.subscriptions.entitlements(),
      });
    },
  });
};

export const useSetSubscriptionDomains = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subscriptionId,
      payload,
    }: {
      subscriptionId: string;
      payload: SetSubscriptionDomainsPayload;
    }) => subscriptionsApi.setDomains(subscriptionId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.subscriptions.list(),
      });
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.subscriptions.entitlements(),
      });
    },
  });
};
