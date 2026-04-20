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
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/axios";

const JIRA_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const PROJECT_KEY = "PM";
const PROJECT_ID = "10071";
const MAX_RESULTS = "500";
const ITEMS_PER_PAGE = 8;

interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  issueType: string;
  status: string;
  assignee: string;
  priority: string;
  updated: string;
  inSprint?: boolean;
  inBacklog?: boolean;
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

type LaneKey = "backlog" | "todo" | "inProgress" | "done" | "other";

function isDoneStatus(status: string) {
  const normalized = status.toLowerCase();
  return (
    normalized.includes("done") ||
    normalized.includes("closed") ||
    normalized.includes("resolved")
  );
}

function classifyIssue(issue: JiraIssue): LaneKey {
  const normalized = issue.status.toLowerCase();
  if (
    issue.inBacklog &&
    (normalized.includes("todo") ||
      normalized.includes("to do") ||
      normalized.includes("open") ||
      normalized.includes("backlog"))
  ) {
    return "backlog";
  }
  if (
    normalized.includes("todo") ||
    normalized.includes("to do") ||
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
  if (isDoneStatus(issue.status)) {
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

function getLaneCardPalette(lane: LaneKey, index: number) {
  const palettes: Record<
    LaneKey,
    Array<{ card: string; key: string; meta: string; glow: string; rail: string }>
  > = {
    backlog: [
      {
        card: "border-[#d8c4ff] bg-[linear-gradient(135deg,#faf5ff_0%,#efe3ff_100%)]",
        key: "text-[#6b21a8]",
        meta: "bg-[#f3e8ff] text-[#5b21b6]",
        glow: "shadow-[0_12px_26px_-18px_rgba(139,92,246,0.95)]",
        rail: "bg-[linear-gradient(90deg,#a855f7_0%,#7c3aed_100%)]",
      },
      {
        card: "border-[#e9d5ff] bg-[linear-gradient(135deg,#fdf4ff_0%,#f5e9ff_100%)]",
        key: "text-[#7e22ce]",
        meta: "bg-[#fae8ff] text-[#86198f]",
        glow: "shadow-[0_12px_26px_-18px_rgba(192,132,252,0.95)]",
        rail: "bg-[linear-gradient(90deg,#c026d3_0%,#7c3aed_100%)]",
      },
      {
        card: "border-[#c4b5fd] bg-[linear-gradient(135deg,#ede9fe_0%,#ddd6fe_100%)]",
        key: "text-[#5b21b6]",
        meta: "bg-[#ddd6fe] text-[#4c1d95]",
        glow: "shadow-[0_12px_26px_-18px_rgba(124,58,237,0.95)]",
        rail: "bg-[linear-gradient(90deg,#7c3aed_0%,#6366f1_100%)]",
      },
      {
        card: "border-[#f0abfc] bg-[linear-gradient(135deg,#fdf4ff_0%,#fae8ff_100%)]",
        key: "text-[#a21caf]",
        meta: "bg-[#f5d0fe] text-[#86198f]",
        glow: "shadow-[0_12px_26px_-18px_rgba(217,70,239,0.95)]",
        rail: "bg-[linear-gradient(90deg,#d946ef_0%,#a855f7_100%)]",
      },
    ],
    todo: [
      {
        card: "border-[#7dd3fc] bg-[linear-gradient(130deg,#e0f2fe_0%,#dbeafe_52%,#e0e7ff_100%)]",
        key: "text-[#1e40af]",
        meta: "bg-[#dbeafe] text-[#1e3a8a]",
        glow: "shadow-[0_18px_36px_-18px_rgba(59,130,246,1)]",
        rail: "bg-[linear-gradient(90deg,#0ea5e9_0%,#2563eb_55%,#4f46e5_100%)]",
      },
      {
        card: "border-[#67e8f9] bg-[linear-gradient(130deg,#ecfeff_0%,#dbeafe_62%,#e0f2fe_100%)]",
        key: "text-[#075985]",
        meta: "bg-[#cffafe] text-[#0c4a6e]",
        glow: "shadow-[0_18px_36px_-18px_rgba(14,165,233,1)]",
        rail: "bg-[linear-gradient(90deg,#06b6d4_0%,#0ea5e9_50%,#2563eb_100%)]",
      },
      {
        card: "border-[#93c5fd] bg-[linear-gradient(130deg,#eff6ff_0%,#dbeafe_50%,#c7d2fe_100%)]",
        key: "text-[#1d4ed8]",
        meta: "bg-[#dbeafe] text-[#1e3a8a]",
        glow: "shadow-[0_18px_36px_-18px_rgba(37,99,235,1)]",
        rail: "bg-[linear-gradient(90deg,#38bdf8_0%,#3b82f6_55%,#6366f1_100%)]",
      },
      {
        card: "border-[#60a5fa] bg-[linear-gradient(130deg,#ecfeff_0%,#dbeafe_56%,#dbeafe_100%)]",
        key: "text-[#1e3a8a]",
        meta: "bg-[#bfdbfe] text-[#1e3a8a]",
        glow: "shadow-[0_18px_36px_-18px_rgba(37,99,235,1)]",
        rail: "bg-[linear-gradient(90deg,#22d3ee_0%,#3b82f6_55%,#4338ca_100%)]",
      },
    ],
    inProgress: [
      {
        card: "border-[#fdba74] bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_45%,#fee2e2_100%)]",
        key: "text-[#b45309]",
        meta: "bg-[#ffedd5] text-[#9a3412]",
        glow: "shadow-[0_18px_36px_-18px_rgba(249,115,22,1)]",
        rail: "bg-[linear-gradient(90deg,#fb923c_0%,#f97316_55%,#ef4444_100%)]",
      },
      {
        card: "border-[#fb923c] bg-[linear-gradient(135deg,#fff7ed_0%,#fed7aa_52%,#fecaca_100%)]",
        key: "text-[#c2410c]",
        meta: "bg-[#fed7aa] text-[#9a3412]",
        glow: "shadow-[0_18px_36px_-18px_rgba(234,88,12,1)]",
        rail: "bg-[linear-gradient(90deg,#fb923c_0%,#f59e0b_40%,#ef4444_100%)]",
      },
      {
        card: "border-[#f59e0b] bg-[linear-gradient(135deg,#fefce8_0%,#fde68a_45%,#fdba74_100%)]",
        key: "text-[#a16207]",
        meta: "bg-[#fde68a] text-[#854d0e]",
        glow: "shadow-[0_18px_36px_-18px_rgba(217,119,6,1)]",
        rail: "bg-[linear-gradient(90deg,#fbbf24_0%,#f97316_50%,#fb7185_100%)]",
      },
      {
        card: "border-[#f97316] bg-[linear-gradient(135deg,#fff7ed_0%,#fdba74_50%,#fca5a5_100%)]",
        key: "text-[#9a3412]",
        meta: "bg-[#fdba74] text-[#7c2d12]",
        glow: "shadow-[0_18px_36px_-18px_rgba(249,115,22,1)]",
        rail: "bg-[linear-gradient(90deg,#fb923c_0%,#ea580c_55%,#ef4444_100%)]",
      },
    ],
    done: [
      {
        card: "border-[#86efac] bg-[linear-gradient(135deg,#f0fdf4_0%,#dcfce7_100%)]",
        key: "text-[#15803d]",
        meta: "bg-[#dcfce7] text-[#166534]",
        glow: "shadow-[0_12px_26px_-18px_rgba(34,197,94,0.95)]",
        rail: "bg-[linear-gradient(90deg,#22c55e_0%,#16a34a_100%)]",
      },
      {
        card: "border-[#a7f3d0] bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_100%)]",
        key: "text-[#047857]",
        meta: "bg-[#d1fae5] text-[#065f46]",
        glow: "shadow-[0_12px_26px_-18px_rgba(16,185,129,0.95)]",
        rail: "bg-[linear-gradient(90deg,#34d399_0%,#10b981_100%)]",
      },
      {
        card: "border-[#4ade80] bg-[linear-gradient(135deg,#f0fdf4_0%,#bbf7d0_100%)]",
        key: "text-[#15803d]",
        meta: "bg-[#bbf7d0] text-[#166534]",
        glow: "shadow-[0_12px_26px_-18px_rgba(74,222,128,0.95)]",
        rail: "bg-[linear-gradient(90deg,#4ade80_0%,#22c55e_100%)]",
      },
      {
        card: "border-[#6ee7b7] bg-[linear-gradient(135deg,#ecfdf5_0%,#a7f3d0_100%)]",
        key: "text-[#047857]",
        meta: "bg-[#a7f3d0] text-[#065f46]",
        glow: "shadow-[0_12px_26px_-18px_rgba(52,211,153,0.95)]",
        rail: "bg-[linear-gradient(90deg,#2dd4bf_0%,#10b981_100%)]",
      },
    ],
    other: [
      {
        card: "border-[#fecaca] bg-[linear-gradient(135deg,#fef2f2_0%,#fee2e2_100%)]",
        key: "text-[#b91c1c]",
        meta: "bg-[#fee2e2] text-[#991b1b]",
        glow: "shadow-[0_12px_26px_-18px_rgba(239,68,68,0.95)]",
        rail: "bg-[linear-gradient(90deg,#ef4444_0%,#dc2626_100%)]",
      },
      {
        card: "border-[#fed7aa] bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)]",
        key: "text-[#c2410c]",
        meta: "bg-[#ffedd5] text-[#9a3412]",
        glow: "shadow-[0_12px_26px_-18px_rgba(251,146,60,0.95)]",
        rail: "bg-[linear-gradient(90deg,#fb923c_0%,#ea580c_100%)]",
      },
      {
        card: "border-[#fca5a5] bg-[linear-gradient(135deg,#fff1f2_0%,#fecdd3_100%)]",
        key: "text-[#be123c]",
        meta: "bg-[#fecdd3] text-[#9f1239]",
        glow: "shadow-[0_12px_26px_-18px_rgba(244,63,94,0.95)]",
        rail: "bg-[linear-gradient(90deg,#fb7185_0%,#e11d48_100%)]",
      },
      {
        card: "border-[#fdba74] bg-[linear-gradient(135deg,#fff7ed_0%,#fed7aa_100%)]",
        key: "text-[#b45309]",
        meta: "bg-[#fed7aa] text-[#92400e]",
        glow: "shadow-[0_12px_26px_-18px_rgba(251,146,60,0.95)]",
        rail: "bg-[linear-gradient(90deg,#fdba74_0%,#f97316_100%)]",
      },
    ],
  };

  const paletteList = palettes[lane];
  return paletteList[index % paletteList.length];
}

export default function JiraPage() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeLane, setActiveLane] = useState<LaneKey>("todo");
  const [activeLanePage, setActiveLanePage] = useState(1);

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams({
          projectKey: PROJECT_KEY,
          projectId: PROJECT_ID,
          maxResults: MAX_RESULTS,
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
                maxResults: Number(MAX_RESULTS),
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

  const classifiedIssues = useMemo(() => {
    return filteredIssues.reduce<Record<LaneKey, JiraIssue[]>>(
      (acc, issue) => {
        const lane = classifyIssue(issue);
        acc[lane].push(issue);
        return acc;
      },
      { backlog: [], todo: [], inProgress: [], done: [], other: [] },
    );
  }, [filteredIssues]);

  const activeLaneIssues = classifiedIssues[activeLane];
  const totalLanePages = Math.max(1, Math.ceil(activeLaneIssues.length / ITEMS_PER_PAGE));
  const safePage = Math.min(activeLanePage, totalLanePages);
  const lanePreviewIssues = activeLaneIssues.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const lanes: Array<{
    key: LaneKey;
    title: string;
    subtitle: string;
    accent: string;
    bg: string;
    border: string;
    glow: string;
  }> = [
    {
      key: "backlog",
      title: "Backlog",
      subtitle: "Idea parking lot",
      accent: "text-[#6b21a8]",
      bg: "bg-[linear-gradient(135deg,#f5f3ff_0%,#ede9fe_45%,#fae8ff_100%)]",
      border: "border-[#d8b4fe]",
      glow: "shadow-[0_14px_32px_-16px_rgba(147,51,234,0.95)]",
    },
    {
      key: "todo",
      title: "To Do",
      subtitle: "Planned next",
      accent: "text-[#1e3a8a]",
      bg: "bg-[linear-gradient(135deg,#ecfeff_0%,#dbeafe_40%,#e0e7ff_75%,#ccfbf1_100%)]",
      border: "border-[#7dd3fc]",
      glow: "shadow-[0_14px_32px_-16px_rgba(14,116,244,1)]",
    },
    {
      key: "inProgress",
      title: "In Progress",
      subtitle: "Actively moving",
      accent: "text-[#9a3412]",
      bg: "bg-[linear-gradient(135deg,#fff7ed_0%,#fdba74_35%,#fde68a_70%,#fecaca_100%)]",
      border: "border-[#fb923c]",
      glow: "shadow-[0_14px_32px_-16px_rgba(249,115,22,1)]",
    },
    {
      key: "done",
      title: "Done",
      subtitle: "Completed",
      accent: "text-[#166534]",
      bg: "bg-[linear-gradient(135deg,#f0fdf4_0%,#dcfce7_45%,#d1fae5_100%)]",
      border: "border-[#86efac]",
      glow: "shadow-[0_14px_32px_-16px_rgba(22,163,74,0.95)]",
    },
    {
      key: "other",
      title: "Other",
      subtitle: "Unmapped status",
      accent: "text-[#7c2d12]",
      bg: "bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_40%,#fee2e2_100%)]",
      border: "border-[#fdba74]",
      glow: "shadow-[0_14px_32px_-16px_rgba(234,88,12,0.95)]",
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
            <div className="space-y-5">
              <section className="rounded-2xl border border-[#dce7ea] bg-[linear-gradient(180deg,#fbffff_0%,#f5fbfb_100%)] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#0f766e]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4d666f]">
                      Classified Board
                    </p>
                  </div>
                  <p className="text-xs font-semibold text-[#5e7880]">
                    Focus mode: one lane at a time
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
                  {lanes.map((lane) => {
                    const isActive = lane.key === activeLane;
                    const count = classifiedIssues[lane.key].length;
                    const isHighlightLane =
                      lane.key === "todo" || lane.key === "inProgress";
                    return (
                      <button
                        key={lane.key}
                        type="button"
                        onClick={() => {
                          setActiveLane(lane.key);
                          setActiveLanePage(1);
                        }}
                        className={`rounded-2xl border p-3 text-left transition-all duration-200 ${lane.bg} ${lane.border} ${
                          isActive
                            ? `${lane.glow} scale-[1.02]`
                            : "opacity-80 hover:-translate-y-0.5 hover:opacity-100"
                        } ${
                          isHighlightLane && isActive
                            ? "ring-2 ring-white/80 ring-offset-1 ring-offset-transparent"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className={`inline-flex items-center gap-1.5 text-sm font-black ${lane.accent}`}>
                              {lane.title}
                              {isHighlightLane && isActive ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                              ) : null}
                            </p>
                            <p className="text-xs text-[#5f757c]">{lane.subtitle}</p>
                          </div>
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-[#21404a]">
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-2xl border border-[#d7e6e9] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-black text-[#17363f]">
                      {lanes.find((lane) => lane.key === activeLane)?.title} Lane
                    </p>
                    <p className="text-xs font-semibold text-[#607b82]">
                      {activeLaneIssues.length} issues
                    </p>
                  </div>

                  {activeLaneIssues.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#cbdde1] bg-[#f8fcfd] p-4 text-sm text-[#698187]">
                      No issues in this lane.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lanePreviewIssues.map((issue, index) => {
                        const palette = getLaneCardPalette(
                          activeLane,
                          (safePage - 1) * ITEMS_PER_PAGE + index,
                        );
                        return (
                          <article
                            key={issue.id}
                            className={`relative overflow-hidden rounded-xl border p-3 transition hover:-translate-y-0.5 ${palette.card} ${palette.glow}`}
                          >
                            <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${palette.rail}`} />
                            <p className={`text-xs font-black ${palette.key}`}>{issue.key}</p>
                            <p className="mt-1 text-sm font-semibold text-[#1d2a2a]">
                              {issue.summary}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
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
                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${palette.meta}`}>
                                {issue.assignee}
                              </span>
                              <div className="ml-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-right text-xs leading-tight text-[#607679]">
                                <span>Type: {issue.issueType}</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock3 size={12} /> Updated: {formatDateTime(issue.updated)}
                                </span>
                                <a
                                  href={`${JIRA_BASE_URL}/browse/${issue.key}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-bold text-[#1f5f71]"
                                >
                                  Open in Jira <ArrowUpRight size={12} />
                                </a>
                              </div>
                            </div>
                          </article>
                        );
                      })}

                      {totalLanePages > 1 && (
                        <div className="flex justify-center pt-2">
                          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-2 py-1.5">
                          {Array.from({ length: totalLanePages }, (_, index) => index + 1).map(
                            (pageNumber) => (
                              <button
                                key={pageNumber}
                                type="button"
                                onClick={() => setActiveLanePage(pageNumber)}
                                className={`h-7 min-w-7 rounded-md px-2 text-xs font-semibold transition ${
                                  safePage === pageNumber
                                    ? "bg-[#16a34a] text-white shadow-sm"
                                    : "bg-white text-[#36565f] hover:bg-[#dcfce7]"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            ),
                          )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
