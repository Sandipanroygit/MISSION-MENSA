import ScrollToTop from "@/components/common/ScrolltoTop";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  Filter,
  ListTodo,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/axios";

const JIRA_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const PROJECT_KEY = "PM";
const PROJECT_ID = "10071";

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  issueType: string;
  status: string;
  assignee: string;
  priority: string;
  updated: string;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getStatusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized.includes("done") || normalized.includes("closed")) {
    return "bg-[#E8F5E8] text-[#245A2E]";
  }
  if (normalized.includes("progress") || normalized.includes("review")) {
    return "bg-[#E8F1FF] text-[#244A84]";
  }
  if (normalized.includes("todo") || normalized.includes("backlog")) {
    return "bg-[#F3F4F6] text-[#46505A]";
  }
  return "bg-[#FFF3E7] text-[#915E1E]";
}

function getPriorityTone(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized.includes("critical") || normalized.includes("highest")) {
    return "bg-[#fee2e2] text-[#991b1b]";
  }
  if (normalized.includes("high")) {
    return "bg-[#ffedd5] text-[#9a3412]";
  }
  if (normalized.includes("medium")) {
    return "bg-[#fef3c7] text-[#92400e]";
  }
  if (normalized.includes("low")) {
    return "bg-[#dcfce7] text-[#166534]";
  }
  return "bg-[#eef2ff] text-[#3730a3]";
}

type LaneKey = "todo" | "inProgress" | "done" | "other";

function classifyStatus(status: string): LaneKey {
  const normalized = status.toLowerCase();
  if (
    normalized.includes("todo") ||
    normalized.includes("to do") ||
    normalized.includes("backlog") ||
    normalized.includes("open")
  ) {
    return "todo";
  }
  if (
    normalized.includes("progress") ||
    normalized.includes("review") ||
    normalized.includes("testing") ||
    normalized.includes("qa") ||
    normalized.includes("blocked")
  ) {
    return "inProgress";
  }
  if (normalized.includes("done") || normalized.includes("closed") || normalized.includes("resolved")) {
    return "done";
  }
  return "other";
}

async function readErrorMessage(response: Response, source: string) {
  const bodyText = await response.text();
  let details = bodyText;

  try {
    const parsed = JSON.parse(bodyText) as { error?: string; details?: string };
    details = parsed.details || parsed.error || bodyText;
  } catch {
    // keep raw text fallback
  }

  return `${source} failed with ${response.status}: ${details.slice(0, 280)}`;
}

export default function JiraPage() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          projectKey: PROJECT_KEY,
          projectId: PROJECT_ID,
          maxResults: "30",
        }).toString();
        const localUrl = `/api/jira/issues?${query}`;

        let payload: { issues?: JiraIssue[] } | null = null;
        const localResponse = await fetch(localUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (localResponse.ok) {
          payload = (await localResponse.json()) as { issues?: JiraIssue[] };
        } else if (localResponse.status !== 404) {
          throw new Error(await readErrorMessage(localResponse, "Local Jira API"));
        }

        if (!payload) {
          try {
            const remoteResponse = await apiClient.get("/api/jira/issues", {
              params: {
                projectKey: PROJECT_KEY,
                projectId: PROJECT_ID,
                maxResults: 30,
              },
            });
            payload = remoteResponse.data as { issues?: JiraIssue[] };
          } catch (remoteError: any) {
            const details =
              remoteError?.response?.data?.details ||
              remoteError?.response?.data?.error ||
              remoteError?.message ||
              "Unable to read Jira data.";
            throw new Error(`Backend Jira API failed: ${String(details).slice(0, 280)}`);
          }
        }

        setIssues(payload.issues ?? []);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to read Jira data.";
        setError(
          `${message} (Ensure local /api/jira/issues or backend /api/jira/issues is available.)`,
        );
      } finally {
        setLoading(false);
      }
    }

    void fetchIssues();
  }, []);

  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(issues.map((issue) => issue.status)))],
    [issues],
  );

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const statusMatch = statusFilter === "All" || issue.status === statusFilter;
      const queryMatch =
        !query.trim() ||
        `${issue.key} ${issue.summary} ${issue.assignee}`
          .toLowerCase()
          .includes(query.trim().toLowerCase());
      return statusMatch && queryMatch;
    });
  }, [issues, query, statusFilter]);

  const openCount = issues.filter(
    (issue) => !issue.status.toLowerCase().includes("done"),
  ).length;
  const doneCount = issues.filter((issue) =>
    issue.status.toLowerCase().includes("done"),
  ).length;
  const completionRatio = issues.length ? Math.round((doneCount / issues.length) * 100) : 0;

  const statusSummary = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const issue of issues) {
      buckets.set(issue.status, (buckets.get(issue.status) ?? 0) + 1);
    }

    return Array.from(buckets.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [issues]);

  const classifiedIssues = useMemo(() => {
    return filteredIssues.reduce<Record<LaneKey, JiraIssue[]>>(
      (acc, issue) => {
        const lane = classifyStatus(issue.status);
        acc[lane].push(issue);
        return acc;
      },
      { todo: [], inProgress: [], done: [], other: [] },
    );
  }, [filteredIssues]);

  const lanes: Array<{
    key: LaneKey;
    title: string;
    subtitle: string;
    accent: string;
    bg: string;
    border: string;
  }> = [
    {
      key: "todo",
      title: "To Do",
      subtitle: "Planned next",
      accent: "text-[#1d4ed8]",
      bg: "bg-[#eff6ff]",
      border: "border-[#bfdbfe]",
    },
    {
      key: "inProgress",
      title: "In Progress",
      subtitle: "Actively moving",
      accent: "text-[#0f766e]",
      bg: "bg-[#ecfeff]",
      border: "border-[#99f6e4]",
    },
    {
      key: "done",
      title: "Done",
      subtitle: "Completed",
      accent: "text-[#166534]",
      bg: "bg-[#f0fdf4]",
      border: "border-[#bbf7d0]",
    },
    {
      key: "other",
      title: "Other",
      subtitle: "Unmapped status",
      accent: "text-[#7c2d12]",
      bg: "bg-[#fff7ed]",
      border: "border-[#fed7aa]",
    },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#f8fafc_46%,#ecfeff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <ScrollToTop />
      <div className="mx-auto max-w-7xl">
        <section className="relative mb-6 overflow-hidden rounded-[1.8rem] border border-[#d7e3e5] bg-[linear-gradient(135deg,#0f172a_0%,#0c4a6e_55%,#115e59_100%)] p-6 shadow-lg">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#67e8f9]/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 left-20 h-44 w-44 rounded-full bg-[#a7f3d0]/20 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100/90">
              Project Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              Jira Command Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-cyan-50/90">
              Clean, filterable, and real-time friendly view of your PM board.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                Project: {PROJECT_KEY}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                Completion: {completionRatio}%
              </span>
            </div>
          </div>
          <div className="relative mt-5 flex flex-wrap gap-2">
            <a
              href={`${JIRA_BASE_URL}/jira/software/projects/${PROJECT_KEY}/boards`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-cyan-100/30 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-white/20"
            >
              Open Board <ArrowUpRight size={14} />
            </a>
            <a
              href={`${JIRA_BASE_URL}/jira/software/projects/${PROJECT_KEY}/backlog`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-cyan-100/30 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-white/20"
            >
              Open Backlog <ArrowUpRight size={14} />
            </a>
            <a
              href={`${JIRA_BASE_URL}/issues/?jql=${encodeURIComponent(
                `project = ${PROJECT_KEY} ORDER BY updated DESC`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-cyan-100/30 bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-white/20"
            >
              Advanced Search <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#dbe7ea] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
                Total Issues
              </p>
              <BarChart3 size={16} className="text-[#24697a]" />
            </div>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{issues.length}</p>
          </article>
          <article className="rounded-2xl border border-[#dbe7ea] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
                Open
              </p>
              <ListTodo size={16} className="text-[#24697a]" />
            </div>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{openCount}</p>
          </article>
          <article className="rounded-2xl border border-[#dbe7ea] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
                Done
              </p>
              <CheckCircle2 size={16} className="text-[#24697a]" />
            </div>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{doneCount}</p>
          </article>
          <article className="rounded-2xl border border-[#dbe7ea] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
                Completion
              </p>
              <CircleDotDashed size={16} className="text-[#24697a]" />
            </div>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{completionRatio}%</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#e2edf0]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e_0%,#14b8a6_100%)]"
                style={{ width: `${completionRatio}%` }}
              />
            </div>
          </article>
        </section>

        <section className="mb-6 rounded-2xl border border-[#dfe9ea] bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5e7880]">
            Status Breakdown
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {statusSummary.slice(0, 8).map((item) => {
              const width = issues.length ? Math.max(6, Math.round((item.count / issues.length) * 100)) : 0;
              return (
                <article key={item.label} className="rounded-xl border border-[#e3edf0] bg-[#fbfefe] p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-[#173237]">{item.label}</p>
                    <span className="text-sm font-black text-[#24454d]">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#dbe8eb]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#14b8a6_100%)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#dfe9ea] bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8d92]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by issue key, summary, assignee"
                className="w-full rounded-xl border border-[#d4e2e4] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#2f6e7e]"
              />
            </label>

            <label className="relative min-w-[220px]">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8d92]" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full appearance-none rounded-xl border border-[#d4e2e4] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#2f6e7e]"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-[#f4d4d4] bg-[#fff3f3] px-4 py-3 text-sm text-[#8f4040]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Live Jira data not available here.</p>
                <p className="mt-1">
                  {error} Open Jira directly using the quick links above.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <p className="py-8 text-center text-sm text-[#6b7e83]">
              Loading Jira issues...
            </p>
          ) : filteredIssues.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#6b7e83]">
              No issues matched your filter.
            </p>
          ) : (
            <div className="space-y-6">
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5e7880]">
                    Classified Board
                  </p>
                  <p className="text-xs font-semibold text-[#5e7880]">
                    {filteredIssues.length} issues in current view
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-4">
                  {lanes.map((lane) => {
                    const laneIssues = classifiedIssues[lane.key];
                    return (
                      <article
                        key={lane.key}
                        className={`rounded-2xl border ${lane.border} ${lane.bg} p-3`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div>
                            <h3 className={`text-base font-black ${lane.accent}`}>
                              {lane.title}
                            </h3>
                            <p className="text-xs text-[#4f6368]">{lane.subtitle}</p>
                          </div>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#1f343a] shadow-sm">
                            {laneIssues.length}
                          </span>
                        </div>

                        {laneIssues.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-[#cbdde1] bg-white/70 p-3 text-xs text-[#698187]">
                            No issues
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {laneIssues.map((issue) => (
                              <a
                                key={issue.id}
                                href={`${JIRA_BASE_URL}/browse/${issue.key}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-xl border border-[#d8e8eb] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-xs font-black text-[#1f5f71]">
                                    {issue.key}
                                  </p>
                                  <ArrowUpRight size={12} className="text-[#6a868d]" />
                                </div>
                                <p className="mt-1 line-clamp-2 text-sm font-semibold text-[#1d2a2a]">
                                  {issue.summary}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getPriorityTone(
                                      issue.priority,
                                    )}`}
                                  >
                                    {issue.priority}
                                  </span>
                                  <span className="rounded-full bg-[#eef6f8] px-2 py-0.5 text-[10px] font-semibold text-[#39565e]">
                                    {issue.assignee}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>

              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5e7880]">
                  All Issues
                </p>
                <div className="grid gap-3 lg:grid-cols-2">
                  {filteredIssues.map((issue) => (
                    <article
                      key={issue.id}
                      className="rounded-2xl border border-[#e1ebec] bg-[linear-gradient(180deg,#fcfefe_0%,#f7fbfb_100%)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <a
                            href={`${JIRA_BASE_URL}/browse/${issue.key}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-bold text-[#1f5f71]"
                          >
                            {issue.key}
                            <ArrowUpRight size={13} />
                          </a>
                          <h3 className="mt-1 text-base font-semibold text-[#1d2a2a]">
                            {issue.summary}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(
                              issue.status,
                            )}`}
                          >
                            {issue.status}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityTone(
                              issue.priority,
                            )}`}
                          >
                            {issue.priority}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#607679]">
                        <span>Type: {issue.issueType}</span>
                        <span>Assignee: {issue.assignee}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={12} /> Updated: {formatDateTime(issue.updated)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
