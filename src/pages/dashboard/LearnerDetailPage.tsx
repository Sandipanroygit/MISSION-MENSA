import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import OverviewTab from "@/components/dashboard/learner/OverviewTab";
import RoadmapTab from "@/components/dashboard/learner/RoadmapTab";
import ReportTab from "@/components/dashboard/learner/ReportTab";
import SubmissionsTab from "@/components/dashboard/learner/SubmissionsTab";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "roadmap", label: "Roadmap" },
  { id: "report", label: "Report" },
  { id: "submissions", label: "Submissions" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function getInitials(name: string) {
  return name
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

export default function LearnerDetailPage() {
  const { learnerId } = useParams<{ learnerId: string }>();
  const { learners, isLoading } = useAuthContext();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  const learner = learners.find((l) => l.id === learnerId);

  if (!learner) {
    return <Navigate to="/dashboard/writing-blogs" replace />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-400">
        <Link
          to="/dashboard/writing-blogs"
          className="hover:text-[#2CA4A4] transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-[#2F3E3E]">{`${learner.first_name} ${learner?.last_name ?? ""}`}</span>
      </nav>

      {/* Learner header */}
      <div className="mb-8 flex items-center gap-4">
        <span
          className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${avatarColour(learner.id)}`}
        >
          {getInitials(learner.first_name)}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-[#2F3E3E]">{`${learner.first_name} ${learner?.last_name ?? ""}`}</h1>
          {learner.date_of_birth && (
            <p className="text-sm text-gray-400">
              DOB: {new Date(learner.date_of_birth).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 -mb-px
              ${
                activeTab === tab.id
                  ? "border-[#2CA4A4] text-[#2CA4A4]"
                  : "border-transparent text-gray-500 hover:text-[#2F3E3E] hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && <OverviewTab learnerId={learner.id} />}
        {activeTab === "roadmap" && <RoadmapTab learnerId={learner.id} />}
        {activeTab === "report" && <ReportTab learnerId={learner.id} />}
        {activeTab === "submissions" && (
          <SubmissionsTab learnerId={learner.id} />
        )}
      </div>
    </div>
  );
}
