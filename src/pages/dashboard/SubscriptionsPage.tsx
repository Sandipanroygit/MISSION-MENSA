import {
  Loader2,
  CreditCard,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useSubscriptions, useEntitlements } from "@/hooks/useSubscription";
import { useDomains } from "@/hooks/useCatalog";

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const isActive = status.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold
        ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
    >
      {isActive ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
      {status}
    </span>
  );
}

export default function SubscriptionsPage() {
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { data: entitlements, isLoading: entLoading } = useEntitlements();
  const { data: allDomains } = useDomains();

  const isLoading = subsLoading || entLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  const entitledDomainIds = entitlements?.domains ?? [];
  const entitledDomains =
    allDomains?.filter((d) => entitledDomainIds.includes(d.id)) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2F3E3E]">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your current plan and domain access.
        </p>
      </div>

      {/* Subscription cards */}
      {!subscriptions || subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <CreditCard size={40} className="mb-3 text-gray-300" />
          <p className="font-semibold text-gray-500">No active subscription</p>
          <p className="mt-1 text-sm text-gray-400">
            Contact support to activate a plan.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2CA4A4]/10">
                    <CreditCard size={18} className="text-[#2CA4A4]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2F3E3E]">
                      {sub.plan ?? "Standard Plan"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Household subscription
                    </p>
                  </div>
                </div>
                <StatusBadge status={sub.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {sub.started_at && (
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-400">Started</p>
                    <p className="font-medium text-[#2F3E3E]">
                      {new Date(sub.started_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {sub.expires_at && (
                  <div className="rounded-xl bg-gray-50 px-3 py-2">
                    <p className="text-xs text-gray-400">Expires</p>
                    <p className="font-medium text-[#2F3E3E]">
                      {new Date(sub.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entitled domains */}
      <div>
        <h2 className="text-base font-semibold text-[#2F3E3E] mb-4">
          Included Domains
        </h2>
        {entitledDomains.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">
              No domains are included in your current plan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entitledDomains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#2CA4A4]/10">
                  <BookOpen size={14} className="text-[#2CA4A4]" />
                </div>
                <span className="text-sm font-medium text-[#2F3E3E]">
                  {domain.name}
                </span>
                <CheckCircle2
                  size={14}
                  className="ml-auto text-green-500 flex-shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
