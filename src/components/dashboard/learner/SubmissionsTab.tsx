import { useState } from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useLearnerRoadmap } from "@/hooks/useLearner";
import {
  useLearnerSubmissions,
  useApproveSubmission,
  useRejectSubmission,
} from "@/hooks/useLearner";
import type { Submission } from "@/types/api";

interface SubmissionsTabProps {
  learnerId: string;
}

// Sub-component that loads and renders submissions for a single activity
function ActivitySubmissions({
  learnerId,
  activityId,
  activityTitle,
}: {
  learnerId: string;
  activityId: string;
  activityTitle: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: submissions, isLoading } = useLearnerSubmissions(
    learnerId,
    activityId,
  );
  const approve = useApproveSubmission();
  const reject = useRejectSubmission();
  const [rejectFeedback, setRejectFeedback] = useState<Record<string, string>>(
    {},
  );
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const pending = submissions?.filter((s) => s.status === "pending") ?? [];

  if (!isLoading && pending.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#2F3E3E]">{activityTitle}</span>
          {isLoading ? (
            <Loader2 size={13} className="animate-spin text-gray-300" />
          ) : (
            pending.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-[#E8506A]/10 px-2 py-0.5 text-xs font-semibold text-[#E8506A]">
                {pending.length} pending
              </span>
            )
          )}
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400" />
        ) : (
          <ChevronDown size={16} className="text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[#2CA4A4]" />
            </div>
          ) : pending.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">
              No pending submissions.
            </p>
          ) : (
            pending.map((submission: Submission) => (
              <div key={submission.id} className="px-5 py-4 space-y-3">
                {submission.content && (
                  <p className="text-sm text-[#2F3E3E] bg-gray-50 rounded-xl p-3">
                    {submission.content}
                  </p>
                )}
                {submission.file_url && (
                  <a
                    href={submission.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#2CA4A4] underline"
                  >
                    View submitted file
                  </a>
                )}
                <p className="text-xs text-gray-400">
                  Submitted{" "}
                  {new Date(submission.submitted_at).toLocaleDateString()}
                </p>

                {rejectingId === submission.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectFeedback[submission.id] ?? ""}
                      onChange={(e) =>
                        setRejectFeedback((f) => ({
                          ...f,
                          [submission.id]: e.target.value,
                        }))
                      }
                      placeholder="Rejection feedback (optional)…"
                      rows={2}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#2F3E3E] outline-none focus:border-[#2CA4A4] focus:ring-2 focus:ring-[#2CA4A4]/20 transition-all resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          reject.mutate(
                            {
                              learnerId,
                              activityId,
                              submissionId: submission.id,
                              feedback: rejectFeedback[submission.id],
                            },
                            { onSettled: () => setRejectingId(null) },
                          );
                        }}
                        disabled={reject.isPending}
                        className="flex items-center gap-1.5 rounded-xl bg-[#E8506A] px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                      >
                        {reject.isPending && (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setRejectingId(null)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        approve.mutate({
                          learnerId,
                          activityId,
                          submissionId: submission.id,
                        })
                      }
                      disabled={approve.isPending}
                      className="flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors disabled:opacity-60"
                    >
                      {approve.isPending ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={13} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectingId(submission.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-[#E8506A] hover:bg-red-100 transition-colors"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function SubmissionsTab({ learnerId }: SubmissionsTabProps) {
  const { data: roadmap, isLoading } = useLearnerRoadmap(learnerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  // Collect all weeks that might have activities across all domains
  const weeks = roadmap?.domains?.flatMap(({ weeks }) => weeks) ?? [];

  if (weeks.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
        <Clock size={32} className="mx-auto mb-2 text-gray-300" />
        <p className="text-sm text-gray-400">
          No weeks found. Enroll this learner in a domain to see activities.
        </p>
      </div>
    );
  }

  // For each week, we render activity submissions by week ID (serving as a proxy for the activity).
  // The backend uses practical_activity IDs; until a top-level activity index endpoint exists,
  // we use week IDs as activity IDs which triggers fetching per item.
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 mb-4">
        Activity submissions requiring your review are shown below. Expand an
        item to approve or reject.
      </p>
      {weeks.map((week) => (
        <ActivitySubmissions
          key={week.id}
          learnerId={learnerId}
          activityId={week.id}
          activityTitle={week.title}
        />
      ))}
    </div>
  );
}
