import { ArrowRight, BookOpen, Loader2, PlayCircle, Star } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { useLearnerDashboard, useLearnerNext } from "@/hooks/useLearner";

function NextItemCard({ learnerId }: { learnerId: string }) {
  const { data: nextItem, isLoading } = useLearnerNext(learnerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <Loader2 size={20} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  if (!nextItem) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
        <Star size={32} className="mb-2 text-[#F0A500]" />
        <p className="font-semibold text-[#2F3E3E]">You're all caught up!</p>
        <p className="mt-1 text-sm text-gray-400">
          Check back later for new content.
        </p>
      </div>
    );
  }

  const TYPE_LABEL: Record<string, string> = {
    lesson: "Lesson",
    quiz: "Quiz",
    activity: "Practical Activity",
  };

  return (
    <div className="rounded-2xl border border-[#2CA4A4]/20 bg-gradient-to-br from-[#2CA4A4]/5 to-[#2CA4A4]/10 p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#2CA4A4] mb-3">
        Continue Learning
      </p>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-[#2F3E3E]">{nextItem.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {TYPE_LABEL[nextItem.type] ?? nextItem.type}
          </p>
        </div>
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#2CA4A4] shadow-md">
          <PlayCircle size={22} className="text-white" />
        </div>
      </div>
      <button className="mt-4 flex items-center gap-2 rounded-xl bg-[#2CA4A4] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#259090] transition-colors">
        Start Now
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function EnrolledDomainsGrid({ learnerId }: { learnerId: string }) {
  const { data: dashboard, isLoading } = useLearnerDashboard(learnerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  const enrollments = dashboard?.enrollments ?? [];

  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
        <BookOpen size={32} className="mb-2 text-gray-300" />
        <p className="text-sm text-gray-400">
          You're not enrolled in any domains yet. Ask your parent to enroll you!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {enrollments.map((enrollment) => (
        <div
          key={enrollment.id}
          className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F0A500]/10">
            <BookOpen size={15} className="text-[#F0A500]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#2F3E3E] truncate">
              {enrollment.domain_id}
            </p>
            {enrollment.status && (
              <p className="text-xs text-gray-400 capitalize">
                {enrollment.status}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChildDashboard() {
  const { user, learners, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#2CA4A4]" />
      </div>
    );
  }

  // Find the learner linked to this user (user_id match), fallback to first learner
  const myLearner = learners.find((l) => l.user_id === user?.id) ?? learners[0];

  if (!myLearner) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Star size={48} className="mb-4 text-gray-300" />
        <p className="text-lg font-semibold text-[#2F3E3E]">
          No learner profile found
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Ask your parent to set up your learning profile.
        </p>
      </div>
    );
  }

  const firstName = myLearner.name.split(" ")[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2F3E3E]">
          Hey, {firstName}! 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ready to keep learning today?
        </p>
      </div>

      {/* Continue learning */}
      <div className="mb-6">
        <NextItemCard learnerId={myLearner.id} />
      </div>

      {/* My domains */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-[#2F3E3E]">
          My Domains
        </h2>
        <EnrolledDomainsGrid learnerId={myLearner.id} />
      </div>
    </div>
  );
}
