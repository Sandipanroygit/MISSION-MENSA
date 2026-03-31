import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";
import { useEnrollments } from "@/hooks/useEnrollment";
import type { Learner } from "@/types/api";

interface LearnerCardProps {
  learner: Learner;
}

function getInitials(first_name: string) {
  return first_name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLOURS = [
  "bg-[#F0A500]",
  "bg-[#2CA4A4]",
  "bg-[#E8506A]",
  "bg-[#6C63FF]",
  "bg-[#38A169]",
];

function avatarColour(id: string) {
  const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLOURS[sum % AVATAR_COLOURS.length];
}

export default function LearnerCard({ learner }: LearnerCardProps) {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useEnrollments(learner.id);

  const enrollmentCount = enrollments?.length ?? 0;

  return (
    <div
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#2CA4A4]/30 transition-all duration-200 cursor-pointer"
      onClick={() => navigate(`/dashboard/learners/${learner.id}`)}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${avatarColour(learner.id)}`}
        >
          {getInitials(learner.first_name)}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#2F3E3E] truncate">
            {learner.first_name}
          </p>
          {learner.date_of_birth && (
            <p className="text-xs text-gray-400">
              DOB: {new Date(learner.date_of_birth).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Enrollments count */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
        {isLoading ? (
          <Loader2 size={14} className="animate-spin text-gray-300" />
        ) : (
          <>
            <BookOpen size={14} className="text-[#2CA4A4]" />
            <span>
              {enrollmentCount === 0
                ? "No domains enrolled"
                : `${enrollmentCount} domain${enrollmentCount !== 1 ? "s" : ""} enrolled`}
            </span>
          </>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/dashboard/learners/${learner.id}`);
        }}
        className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#2CA4A4]/10 py-2.5 text-sm font-medium text-[#2CA4A4] hover:bg-[#2CA4A4]/20 transition-colors group-hover:bg-[#2CA4A4] group-hover:text-white"
      >
        View Dashboard
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
