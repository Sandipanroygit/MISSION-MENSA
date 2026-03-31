import { useState } from "react";
import {
  Plus,
  Pencil,
  Check,
  X,
  Loader2,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useUpdateLearner } from "@/hooks/useLearner";
import { useEnrollments, useCreateEnrollment } from "@/hooks/useEnrollment";
import { useEntitlements } from "@/hooks/useSubscription";
import { useDomains } from "@/hooks/useCatalog";
import AddLearnerModal from "@/components/dashboard/AddLearnerModal";
import type { Learner } from "@/types/api";

// ─── Learner row ─────────────────────────────────────────────────────────────

function LearnerRow({ learner }: { learner: Learner }) {
  const updateLearner = useUpdateLearner(learner.id);
  const { data: enrollments, isLoading: enrollLoading } = useEnrollments(
    learner.id,
  );
  const { data: entitlements } = useEntitlements();
  const { data: allDomains } = useDomains();
  const createEnrollment = useCreateEnrollment();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(learner.first_name);
  const [editError, setEditError] = useState<string | null>(null);
  const [enrollExpanded, setEnrollExpanded] = useState(false);

  const enrolledDomainIds = new Set(enrollments?.map((e) => e.domain_id) ?? []);
  const entitledDomainIds = new Set(entitlements?.domains ?? []);

  // Domains that are entitled but not yet enrolled
  const availableToEnroll =
    allDomains?.filter(
      (d) => entitledDomainIds.has(d.id) && !enrolledDomainIds.has(d.id),
    ) ?? [];

  const handleSave = () => {
    setEditError(null);
    if (!editName.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }
    updateLearner.mutate(
      { first_name: editName.trim() },
      {
        onSuccess: () => setEditing(false),
        onError: () => setEditError("Failed to save. Please try again."),
      },
    );
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Learner name row */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#2CA4A4] text-sm font-bold text-white">
          {learner.first_name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        {editing ? (
          <div className="flex flex-1 items-center gap-2">
            <input
              autoFocus
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-[#2F3E3E] outline-none focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <button
              onClick={handleSave}
              disabled={updateLearner.isPending}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-60"
            >
              {updateLearner.isPending ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setEditName(learner.first_name);
                setEditError(null);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 font-medium text-[#2F3E3E]">
              {`${learner.first_name} ${learner?.last_name ?? ""}`}
            </span>
            <button
              onClick={() => {
                setEditing(true);
                setEditName(learner.first_name);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#2CA4A4] transition-colors"
              aria-label="Edit name"
            >
              <Pencil size={13} />
            </button>
          </>
        )}
      </div>

      {editError && (
        <p className="px-5 pb-2 text-xs text-red-500">{editError}</p>
      )}

      {/* Enrollments section */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setEnrollExpanded((e) => !e)}
          className="flex w-full items-center justify-between px-5 py-3 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#2CA4A4]" />
            {enrollLoading ? (
              <Loader2 size={13} className="animate-spin text-gray-300" />
            ) : (
              <>
                {enrollments?.length ?? 0} domain
                {(enrollments?.length ?? 0) !== 1 ? "s" : ""} enrolled
              </>
            )}
          </span>
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${enrollExpanded ? "rotate-90" : ""}`}
          />
        </button>

        {enrollExpanded && (
          <div className="border-t border-gray-100 px-5 pb-4 pt-3 space-y-2">
            {/* Current enrollments */}
            {enrollments && enrollments.length > 0 ? (
              <div className="space-y-1 mb-3">
                {enrollments.map((enrollment) => {
                  const domain = allDomains?.find(
                    (d) => d.id === enrollment.domain_id,
                  );
                  return (
                    <div
                      key={enrollment.id}
                      className="flex items-center gap-2 text-sm text-[#2F3E3E]"
                    >
                      <Check
                        size={13}
                        className="text-green-500 flex-shrink-0"
                      />
                      {domain?.name ?? enrollment.domain_id}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-3">No enrollments yet.</p>
            )}

            {/* Add enrollment */}
            {availableToEnroll.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1.5">
                  Add domain:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableToEnroll.map((domain) => (
                    <button
                      key={domain.id}
                      onClick={() =>
                        createEnrollment.mutate({
                          learner_id: learner.id,
                          domain_id: domain.id,
                        })
                      }
                      disabled={createEnrollment.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2CA4A4]/10 px-3 py-1.5 text-xs font-medium text-[#2CA4A4] hover:bg-[#2CA4A4]/20 transition-colors disabled:opacity-60"
                    >
                      {createEnrollment.isPending ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Plus size={11} />
                      )}
                      {domain.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableToEnroll.length === 0 &&
              (enrollments?.length ?? 0) > 0 && (
                <p className="text-xs text-gray-400">
                  All entitled domains are enrolled.
                </p>
              )}

            {entitledDomainIds.size === 0 && (
              <p className="text-xs text-gray-400">
                No domains in your subscription yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnerManagementPage() {
  const { learners, households } = useAuthContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const householdId = households[0]?.id ?? "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3E3E]">Learners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your learners and their domain enrollments.
          </p>
        </div>
        {householdId && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#2CA4A4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#259090] transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add Learner
          </button>
        )}
      </div>

      {learners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <p className="font-semibold text-gray-500">No learners yet</p>
          <p className="mt-1 text-sm text-gray-400">
            Add your first learner to get started.
          </p>
          {householdId && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#2CA4A4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#259090] transition-colors"
            >
              <Plus size={15} />
              Add Learner
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {learners.map((learner) => (
            <LearnerRow key={learner.id} learner={learner} />
          ))}
        </div>
      )}

      {showAddModal && householdId && (
        <AddLearnerModal
          householdId={householdId}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
