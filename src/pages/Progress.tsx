type ProgressStatus = "done" | "in progress" | "pending";

type ProgressItem = {
  task: string;
  owner: string;
  status: ProgressStatus;
};

const statusOrder: ProgressStatus[] = ["done", "in progress", "pending"];

const progressItems: ProgressItem[] = [
  {
    task: "AI Ethics and Chat use training course",
    owner: "Vishwa",
    status: "done",
  },
  {
    task: "Orchestration layer refinement",
    owner: "Kamna",
    status: "done",
  },
  {
    task: "Curriculum design for NIOS and IIT complete",
    owner: "Kamna",
    status: "done",
  },
  {
    task: "Lessons to be designed and persisted in AI tutor platform",
    owner: "Kamna",
    status: "in progress",
  },
  {
    task: "AI literacy module prepared to be integrated into AI tutor",
    owner: "Vishwa",
    status: "in progress",
  },
  {
    task: "Bridge course module prepared to be integrated into AI tutor",
    owner: "Shruti",
    status: "in progress",
  },
  {
    task: "AI Ethics and Chat use training course module ready to be integrated into AI tutor",
    owner: "Vishwa",
    status: "in progress",
  },
  {
    task: "Website refinement",
    owner: "Sandeepan",
    status: "in progress",
  },
  {
    task: "DTP and LE added to student agent",
    owner: "Kamna/Bhawna",
    status: "in progress",
  },
  {
    task: "STEAM added to AI tutor platform",
    owner: "Shruti/Kamna",
    status: "in progress",
  },
  {
    task: "AR VR curriculum details",
    owner: "Shruti",
    status: "in progress",
  },
  {
    task: "AI tutor demo given to stakeholders and feedback inculcated into platform",
    owner: "Kamna/Shruti",
    status: "done",
  },
  {
    task: "Students selection update",
    owner: "Shruti",
    status: "pending",
  },
  {
    task: "NGO visits update",
    owner: "Shruti",
    status: "pending",
  },
  {
    task: "Gap analysis plan and gap assessment readiness",
    owner: "Shruti",
    status: "done",
  },
  {
    task: "Learning pathway - inclusion into AI tutor platform",
    owner: "Kamna/Shruti",
    status: "in progress",
  },
];

const statusConfig: Record<
  ProgressStatus,
  {
    label: string;
    sectionClass: string;
    headerClass: string;
    pillClass: string;
    dotClass: string;
    subtitle: string;
  }
> = {
  done: {
    label: "Done",
    sectionClass: "border-green-200/80 shadow-[0_8px_22px_rgba(34,197,94,0.08)]",
    headerClass: "bg-gradient-to-r from-green-600 to-emerald-500",
    pillClass: "bg-green-100 text-green-800 border border-green-200",
    dotClass: "bg-green-500",
    subtitle: "Completed and verified tasks",
  },
  "in progress": {
    label: "In Progress",
    sectionClass: "border-amber-200/80 shadow-[0_8px_22px_rgba(245,158,11,0.1)]",
    headerClass: "bg-gradient-to-r from-amber-500 to-yellow-500",
    pillClass: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    dotClass: "bg-amber-500",
    subtitle: "Tasks currently under execution",
  },
  pending: {
    label: "Pending",
    sectionClass: "border-slate-200/80 shadow-[0_8px_22px_rgba(100,116,139,0.08)]",
    headerClass: "bg-gradient-to-r from-slate-500 to-slate-400",
    pillClass: "bg-slate-100 text-slate-700 border border-slate-200",
    dotClass: "bg-slate-500",
    subtitle: "Upcoming tasks waiting to start",
  },
};

const ProgressPage = () => {
  const groupedItems: Record<ProgressStatus, ProgressItem[]> = {
    done: progressItems.filter((item) => item.status === "done"),
    "in progress": progressItems.filter((item) => item.status === "in progress"),
    pending: progressItems.filter((item) => item.status === "pending"),
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#f4f7f8] to-[#eef4f5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#cfe2e4] bg-gradient-to-r from-[#1f6f73] via-[#2CA4A4] to-[#5bbfc5] px-6 py-7 shadow-sm">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/20 blur-xl" />
          <div className="absolute -bottom-10 left-12 h-28 w-28 rounded-full bg-white/10 blur-lg" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Mission Mensa
            </p>
            <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              Progress Tracker
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
              Status-wise view of current tasks, owners, and execution updates.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {statusOrder.map((status) => {
            const items = groupedItems[status];
            const ownerCount = new Set(items.map((item) => item.owner)).size;

            return (
              <div
                key={status}
                className={`overflow-hidden rounded-2xl border bg-white ${statusConfig[status].sectionClass}`}
              >
                <div className={`px-4 py-4 text-white sm:px-5 ${statusConfig[status].headerClass}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full bg-white ring-4 ring-white/30`}
                        />
                        <h2 className="text-lg font-bold">{statusConfig[status].label}</h2>
                      </div>
                      <p className="mt-1 text-sm text-white/90">
                        {statusConfig[status].subtitle}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="rounded-lg bg-white/20 px-3 py-2 text-right backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-wide text-white/80">
                          Tasks
                        </p>
                        <p className="text-base font-bold">{items.length}</p>
                      </div>
                      <div className="rounded-lg bg-white/20 px-3 py-2 text-right backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-wide text-white/80">
                          Owners
                        </p>
                        <p className="text-base font-bold">{ownerCount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#e5eded]">
                    <thead className="bg-[#f2f7f7]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#466d70]">
                          Task
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#466d70]">
                          Owner
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#466d70]">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ecf1f2] bg-white">
                      {items.map((item) => (
                        <tr
                          key={`${status}-${item.task}-${item.owner}`}
                          className="transition-colors hover:bg-[#f8fbfc]"
                        >
                          <td className="px-4 py-3 text-sm text-[#294f52]">
                            <div className="flex items-start gap-2.5">
                              <span
                                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${statusConfig[status].dotClass}`}
                              />
                              <span>{item.task}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#355b5f]">
                            <span className="inline-flex rounded-full border border-[#d5e4e5] bg-[#f7fbfb] px-2.5 py-1">
                              {item.owner}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusConfig[status].pillClass}`}
                            >
                              {statusConfig[status].label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgressPage;
