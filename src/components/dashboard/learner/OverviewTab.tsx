import { Loader2, BookOpen, ArrowRight } from "lucide-react";
import { useLearnerDashboard, useLearnerNext } from "@/hooks/useLearner";

interface OverviewTabProps {
  learnerId: string;
}

const NEXT_TYPE_LABELS: Record<string, string> = {
  lesson: "Lesson",
  quiz: "Quiz",
  activity: "Activity",
};

export default function OverviewTab({ learnerId }: OverviewTabProps) {
  const { data: dashboard, isLoading: dashLoading } =
    useLearnerDashboard(learnerId);
  const { data: nextItem, isLoading: nextLoading } = useLearnerNext(learnerId);

  if (dashLoading || nextLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  const enrollments = dashboard?.enrollments ?? [];

  return (
    <div className="space-y-6">
      {/* Next up */}
      {nextItem && (
        <div className="rounded-2xl border border-[#2CA4A4]/20 bg-[#2CA4A4]/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2CA4A4] mb-2">
            Up Next
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#2F3E3E]">{nextItem.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {NEXT_TYPE_LABELS[nextItem.type] ?? nextItem.type}
              </p>
            </div>
            <ArrowRight size={20} className="text-[#2CA4A4] flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Enrollments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Enrolled Domains
        </h3>
        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
            <BookOpen size={32} className="mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No domains enrolled yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
              >
                <BookOpen size={16} className="text-[#2CA4A4] flex-shrink-0" />
                <span className="text-sm font-medium text-[#2F3E3E] truncate">
                  {enrollment.domain_id}
                </span>
                {enrollment.status && (
                  <span className="ml-auto text-xs text-gray-400 capitalize">
                    {enrollment.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
