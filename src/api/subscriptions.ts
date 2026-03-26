import apiClient from "@/lib/axios";
import { SUBSCRIPTIONS } from "@/constants/endpoints";
import type {
  CreateSubscriptionPayload,
  Entitlements,
  SetSubscriptionDomainsPayload,
  Subscription,
} from "@/types/api";

export const subscriptionsApi = {
  list: async (): Promise<Subscription[]> => {
    const { data } = await apiClient.get<Subscription[]>(SUBSCRIPTIONS.BASE);
    return data;
  },

  create: async (payload: CreateSubscriptionPayload): Promise<Subscription> => {
    const { data } = await apiClient.post<Subscription>(
      SUBSCRIPTIONS.BASE,
      payload,
    );
    return data;
  },

  setDomains: async (
    subscriptionId: string,
    payload: SetSubscriptionDomainsPayload,
  ): Promise<Subscription> => {
    const { data } = await apiClient.put<Subscription>(
      SUBSCRIPTIONS.DOMAINS(subscriptionId),
      payload,
    );
    return data;
  },

  getEntitlements: async (): Promise<Entitlements> => {
    const { data } = await apiClient.get<Entitlements>(
      SUBSCRIPTIONS.ENTITLEMENTS,
    );
    return data;
  },
};
