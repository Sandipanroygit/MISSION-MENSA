import { Loader2, Lock, CheckCircle2, PlayCircle, Circle } from "lucide-react";
import { useLearnerRoadmap } from "@/hooks/useLearner";
import type { WeekStatus } from "@/types/api";

interface RoadmapTabProps {
  learnerId: string;
}

const STATUS_CONFIG: Record<
  WeekStatus,
  { label: string; icon: React.ReactNode; pill: string }
> = {
  locked: {
    label: "Locked",
    icon: <Lock size={13} />,
    pill: "bg-gray-100 text-gray-400",
  },
  available: {
    label: "Available",
    icon: <Circle size={13} />,
    pill: "bg-blue-50 text-blue-500",
  },
  in_progress: {
    label: "In Progress",
    icon: <PlayCircle size={13} />,
    pill: "bg-[#F0A500]/10 text-[#F0A500]",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={13} />,
    pill: "bg-green-100 text-green-600",
  },
};

export default function RoadmapTab({ learnerId }: RoadmapTabProps) {
  const { data: roadmap, isLoading } = useLearnerRoadmap(learnerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  if (!roadmap?.domains?.length) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        No roadmap data yet. Enroll this learner in a domain to get started.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {roadmap.domains.map(({ domain, weeks }) => {
        const completed = weeks.filter((w) => w.status === "completed").length;
        const total = weeks.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        return (
          <div
            key={domain.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            {/* Domain header */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-semibold text-[#2F3E3E]">{domain.name}</h3>
              <span className="text-xs text-gray-400">
                {completed}/{total} weeks
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-5 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-[#2CA4A4] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Week grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {weeks.map((week) => {
                const cfg = STATUS_CONFIG[week.status];
                return (
                  <div
                    key={week.id}
                    className="flex flex-col gap-1.5 rounded-xl border border-gray-100 p-3"
                  >
                    <span className="text-xs font-medium text-gray-500 truncate">
                      Week {week.order}
                    </span>
                    <span className="text-sm font-medium text-[#2F3E3E] leading-tight line-clamp-2">
                      {week.title}
                    </span>
                    <span
                      className={`mt-auto inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.pill}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
