import { useState } from "react";
import { Plus, Users, BookOpen, Clock } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import LearnerCard from "@/components/dashboard/LearnerCard";
import AddLearnerModal from "@/components/dashboard/AddLearnerModal";
import { useEnrollments } from "@/hooks/useEnrollment";

function usePendingSubmissionsCount() {
  // Placeholder until a top-level "all submissions" endpoint exists
  return 0;
}

export default function ParentOverview() {
  const { learners, households } = useAuthContext();
  const [showAddModal, setShowAddModal] = useState(false);

  const householdId = households[0]?.id ?? "";
  const totalEnrollmentsQuery = useEnrollments();
  const totalEnrollments = totalEnrollmentsQuery.data?.length ?? 0;
  const pendingCount = usePendingSubmissionsCount();

  const stats = [
    {
      label: "Learners",
      value: learners.length,
      icon: <Users size={18} className="text-[#2CA4A4]" />,
      bg: "bg-[#2CA4A4]/10",
    },
    {
      label: "Active Enrollments",
      value: totalEnrollments,
      icon: <BookOpen size={18} className="text-[#F0A500]" />,
      bg: "bg-[#F0A500]/10",
    },
    {
      label: "Pending Approvals",
      value: pendingCount,
      icon: <Clock size={18} className="text-[#E8506A]" />,
      bg: "bg-[#E8506A]/10",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3E3E]">Parent Overview</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your learners and track their progress across all domains.
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

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-[#2F3E3E]">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Learner cards */}
      {learners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <Users size={40} className="mb-3 text-gray-300" />
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learners.map((learner) => (
            <LearnerCard key={learner.id} learner={learner} />
          ))}
          {/* Add learner card */}
          {householdId && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-gray-400 hover:border-[#2CA4A4]/40 hover:text-[#2CA4A4] transition-colors"
            >
              <Plus size={28} className="mb-2" />
              <span className="text-sm font-medium">Add Learner</span>
            </button>
          )}
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
