import { Loader2 } from "lucide-react";
import { useLearnerReport } from "@/hooks/useLearner";

interface ReportTabProps {
  learnerId: string;
}

export default function ReportTab({ learnerId }: ReportTabProps) {
  const { data: report, isLoading } = useLearnerReport(learnerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  if (!report) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        No report data available yet.
      </p>
    );
  }

  // Extract any numeric/string top-level fields from the report to display as stat cards
  const statEntries = Object.entries(report).filter(
    ([key, value]) =>
      key !== "learner" &&
      (typeof value === "number" || typeof value === "string"),
  );

  return (
    <div className="space-y-6">
      {statEntries.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {statEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <p className="text-2xl font-bold text-[#2F3E3E]">
                {String(value)}
              </p>
              <p className="mt-1 text-xs text-gray-500 capitalize">
                {key.replace(/_/g, " ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
          <p className="text-sm text-gray-400">
            Report data will appear here once the learner starts their journey.
          </p>
        </div>
      )}
    </div>
  );
}
