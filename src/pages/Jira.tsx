import ScrollToTop from "@/components/common/ScrolltoTop";
import { AlertCircle, ArrowUpRight, Clock3, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/axios";

const JIRA_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const PROJECT_KEY = "PM";

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
        const query = `projectKey=${encodeURIComponent(
          PROJECT_KEY,
        )}&maxResults=30`;
        const localUrl = `/api/jira/issues?${query}`;

        let payload: { issues?: JiraIssue[] } | null = null;
        try {
          const localResponse = await fetch(localUrl, {
            method: "GET",
            headers: { Accept: "application/json" },
          });
          if (!localResponse.ok) {
            // fallback to configured backend below
          } else {
            payload = (await localResponse.json()) as { issues?: JiraIssue[] };
          }
        } catch (error) {
          // fallback to configured backend below
        }

        if (!payload) {
          const remoteResponse = await apiClient.get("/api/jira/issues", {
            params: {
              projectKey: PROJECT_KEY,
              maxResults: 30,
            },
          });
          payload = remoteResponse.data as { issues?: JiraIssue[] };
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

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F6F1E7_0%,#FBF8F1_34%,#F4F8F8_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <ScrollToTop />
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[1.7rem] border border-[#dfe9ea] bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black text-[#1D2A2A]">
            Jira Command Center
          </h1>
          <p className="mt-2 text-sm text-[#5E6F73]">
            Faster project view with filters, quick links, and issue spotlight.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`${JIRA_BASE_URL}/jira/software/projects/${PROJECT_KEY}/boards`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#d6e5e7] bg-[#f7fbfc] px-4 py-2 text-sm font-semibold text-[#254953]"
            >
              Open Board <ArrowUpRight size={14} />
            </a>
            <a
              href={`${JIRA_BASE_URL}/jira/software/projects/${PROJECT_KEY}/backlog`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#d6e5e7] bg-[#f7fbfc] px-4 py-2 text-sm font-semibold text-[#254953]"
            >
              Open Backlog <ArrowUpRight size={14} />
            </a>
            <a
              href={`${JIRA_BASE_URL}/issues/?jql=${encodeURIComponent(
                `project = ${PROJECT_KEY} ORDER BY updated DESC`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#d6e5e7] bg-[#f7fbfc] px-4 py-2 text-sm font-semibold text-[#254953]"
            >
              Advanced Search <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#dfe9ea] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
              Total Issues
            </p>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">
              {issues.length}
            </p>
          </article>
          <article className="rounded-2xl border border-[#dfe9ea] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
              Open
            </p>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{openCount}</p>
          </article>
          <article className="rounded-2xl border border-[#dfe9ea] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#678086]">
              Done
            </p>
            <p className="mt-2 text-3xl font-black text-[#1D2A2A]">{doneCount}</p>
          </article>
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
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <article
                  key={issue.id}
                  className="rounded-xl border border-[#e1ebec] bg-[#fcfefe] p-4"
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
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(
                        issue.status,
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#607679]">
                    <span>Type: {issue.issueType}</span>
                    <span>Priority: {issue.priority}</span>
                    <span>Assignee: {issue.assignee}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={12} /> Updated: {formatDateTime(issue.updated)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
