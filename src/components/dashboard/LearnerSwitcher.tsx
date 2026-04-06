import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

function getLearnerInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function LearnerSwitcher() {
  const { learners, isParent, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const { learnerId } = useParams<{ learnerId?: string }>();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeLearner = learnerId
    ? learners.find((l) => l.id === learnerId)
    : null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if ((!isParent && !isAdmin) || learners.length === 0) return null;

  const label = activeLearner
    ? `${activeLearner.first_name} ${activeLearner.last_name ?? ""}`
    : "Parent View";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-[#2F3E3E] shadow-sm hover:border-[#2CA4A4]/40 transition-all duration-200"
        aria-label="Switch learner view"
      >
        {activeLearner ? (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F0A500] text-xs font-bold text-white flex-shrink-0">
            {getLearnerInitials(activeLearner.first_name)}
          </span>
        ) : (
          <LayoutDashboard size={14} className="text-[#2CA4A4] flex-shrink-0" />
        )}
        <span className="hidden sm:block max-w-[110px] truncate">{label}</span>
        <ChevronDown
          size={12}
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            View As
          </p>

          {/* Parent view option */}
          <button
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/writing-blogs");
            }}
            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors
              ${
                !activeLearner
                  ? "bg-[#2CA4A4]/10 font-semibold text-[#2CA4A4]"
                  : "text-[#2F3E3E] hover:bg-[#FAF7F2]"
              }`}
          >
            <LayoutDashboard size={14} className="flex-shrink-0" />
            Parent View
          </button>

          {learners.length > 0 && (
            <div className="border-t border-gray-100 py-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Learners
              </p>
              {learners.map((learner) => {
                const isActive = learner.id === learnerId;
                return (
                  <button
                    key={learner.id}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/dashboard/learners/${learner.id}`);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors
                      ${
                        isActive
                          ? "bg-[#2CA4A4]/10 font-semibold text-[#2CA4A4]"
                          : "text-[#2F3E3E] hover:bg-[#FAF7F2]"
                      }`}
                  >
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F0A500] text-xs font-bold text-white">
                      {getLearnerInitials(learner.first_name)}
                    </span>
                    <span className="truncate">{`${learner.first_name} ${learner?.last_name ?? ""}`}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
