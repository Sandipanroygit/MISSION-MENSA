import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useCreateLearner } from "@/hooks/useLearner";
import { useYearLevels } from "@/hooks/useCatalog";

interface AddLearnerModalProps {
  householdId: string;
  onClose: () => void;
}

export default function AddLearnerModal({
  householdId,
  onClose,
}: AddLearnerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const createLearner = useCreateLearner(householdId);
  const { data: yearLevels, isLoading: levelsLoading } = useYearLevels();

  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    year_level_id: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Close on backdrop click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Learner name is required.");
      return;
    }
    const payload = {
      first_name: form.name.trim(),
      ...(form.date_of_birth && { date_of_birth: form.date_of_birth }),
      ...(form.year_level_id && { year_level_id: form.year_level_id }),
    };
    createLearner.mutate(payload, {
      onSuccess: () => onClose(),
      onError: () => setError("Failed to add learner. Please try again."),
    });
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#2F3E3E]">Add Learner</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-[#2F3E3E] mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Amara Johnson"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#2F3E3E] placeholder-gray-400 outline-none focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2F3E3E] mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) =>
                setForm((f) => ({ ...f, date_of_birth: e.target.value }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#2F3E3E] outline-none focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2F3E3E] mb-1.5">
              Year Level
            </label>
            {levelsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 size={14} className="animate-spin" /> Loading…
              </div>
            ) : (
              <select
                value={form.year_level_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, year_level_id: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#2F3E3E] outline-none focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20 transition-all"
              >
                <option value="">Select year level</option>
                {yearLevels?.map((yl) => (
                  <option key={yl.id} value={yl.id}>
                    {yl.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLearner.isPending}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#2CA4A4] py-2.5 text-sm font-semibold text-white hover:bg-[#259090] transition-colors disabled:opacity-60"
            >
              {createLearner.isPending && (
                <Loader2 size={14} className="animate-spin" />
              )}
              {createLearner.isPending ? "Adding…" : "Add Learner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
