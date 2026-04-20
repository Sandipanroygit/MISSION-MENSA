import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const DEFAULT_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const DEFAULT_PROJECT_KEY = "PM";
const DEFAULT_PROJECT_ID = "10071";
const DEFAULT_BOARD_ID = "70";

function getProjectSelector(projectIdRaw: string | null, projectKeyRaw: string) {
  const projectId = (projectIdRaw || "").trim();
  if (projectId) return projectId;
  return projectKeyRaw.trim().toUpperCase();
}

function mapIssue(issue: any) {
  const fields = issue?.fields || {};
  return {
    id: issue?.id || "",
    key: issue?.key || "",
    summary: fields.summary || "Untitled issue",
    issueType: fields.issuetype?.name || "Task",
    status: fields.status?.name || "Unknown",
    assignee: fields.assignee?.displayName || "Unassigned",
    priority: fields.priority?.name || "None",
    updated: fields.updated || "",
    inSprint: false,
    inBacklog: false,
  };
}

async function fetchBoardBacklogKeys(options: {
  jiraBaseUrl: string;
  basicAuth: string;
  boardId: string;
  requestedMaxResults: number;
}) {
  const { jiraBaseUrl, basicAuth, boardId, requestedMaxResults } = options;
  const backlogKeys = new Set<string>();
  let startAt = 0;
  const pageSize = 50;

  while (backlogKeys.size < requestedMaxResults) {
    const batchSize = Math.min(pageSize, requestedMaxResults - backlogKeys.size);
    const backlogUrl =
      `${jiraBaseUrl}/rest/agile/1.0/board/${encodeURIComponent(boardId)}/backlog` +
      `?startAt=${startAt}&maxResults=${batchSize}`;

    const response = await fetch(backlogUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!response.ok) {
      return backlogKeys;
    }

    const payload = await response.json();
    const issues = Array.isArray(payload?.issues) ? payload.issues : [];
    for (const issue of issues) {
      if (issue?.key) backlogKeys.add(issue.key as string);
    }

    const total = Number(payload?.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }

  return backlogKeys;
}

async function fetchSprintIssueKeys(options: {
  jiraBaseUrl: string;
  basicAuth: string;
  projectSelector: string;
}) {
  const { jiraBaseUrl, basicAuth, projectSelector } = options;
  const inSprintKeys = new Set<string>();
  let startAt = 0;
  const maxResults = 100;

  while (true) {
    const sprintJql = `project = ${projectSelector} AND sprint IS NOT EMPTY`;
    const sprintUrl =
      `${jiraBaseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(sprintJql)}` +
      `&startAt=${startAt}&maxResults=${maxResults}` +
      "&fields=key";

    const response = await fetch(sprintUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!response.ok) {
      return inSprintKeys;
    }

    const payload = await response.json();
    const issues = Array.isArray(payload?.issues) ? payload.issues : [];
    for (const issue of issues) {
      if (issue?.key) inSprintKeys.add(issue.key as string);
    }

    const total = Number(payload?.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }

  return inSprintKeys;
}

async function fetchProjectIssues(options: {
  jiraBaseUrl: string;
  basicAuth: string;
  projectSelector: string;
  requestedMaxResults: number;
}) {
  const { jiraBaseUrl, basicAuth, projectSelector, requestedMaxResults } = options;
  const allIssues: any[] = [];
  let startAt = 0;
  const pageSize = 100;

  while (allIssues.length < requestedMaxResults) {
    const batchSize = Math.min(pageSize, requestedMaxResults - allIssues.length);
    const jql = `project = ${projectSelector} ORDER BY updated DESC`;
    const jiraUrl =
      `${jiraBaseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}` +
      `&startAt=${startAt}&maxResults=${batchSize}` +
      "&fields=summary,status,assignee,priority,updated,issuetype";

    const jiraResponse = await fetch(jiraUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
    });

    if (!jiraResponse.ok) {
      const details = await jiraResponse.text();
      return {
        ok: false as const,
        status: jiraResponse.status,
        details,
        issues: [] as any[],
      };
    }

    const payload = await jiraResponse.json();
    const issues = Array.isArray(payload?.issues) ? payload.issues : [];
    allIssues.push(...issues);

    const total = Number(payload?.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }

  return {
    ok: true as const,
    status: 200,
    details: "",
    issues: allIssues,
  };
}

function jiraDevApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "jira-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const requestUrl = req.url || "";
        const pathname = requestUrl.split("?")[0];

        if (pathname !== "/api/jira/issues") {
          next();
          return;
        }

        if (req.method !== "GET") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const url = new URL(requestUrl, "http://localhost");
        const jiraBaseUrl = env.JIRA_BASE_URL || DEFAULT_BASE_URL;
        const jiraEmail = env.JIRA_EMAIL;
        const jiraApiToken = env.JIRA_API_TOKEN;
        const projectKey = (
          url.searchParams.get("projectKey") ||
          env.JIRA_PROJECT_KEY ||
          DEFAULT_PROJECT_KEY
        )
          .trim()
          .toUpperCase();
        const projectId =
          url.searchParams.get("projectId") ||
          env.JIRA_PROJECT_ID ||
          DEFAULT_PROJECT_ID;
        const boardId =
          url.searchParams.get("boardId") ||
          env.JIRA_BOARD_ID ||
          DEFAULT_BOARD_ID;
        const projectSelector = getProjectSelector(projectId, projectKey);

        if (!jiraEmail || !jiraApiToken) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                "Jira credentials missing in local env. Set JIRA_EMAIL and JIRA_API_TOKEN.",
            }),
          );
          return;
        }

        const maxResults = Math.min(
          Number.parseInt(url.searchParams.get("maxResults") || "200", 10) || 200,
          500,
        );

        const basicAuth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString(
          "base64",
        );

        try {
          const inSprintKeys = await fetchSprintIssueKeys({
            jiraBaseUrl,
            basicAuth,
            projectSelector,
          });
          const backlogKeys = await fetchBoardBacklogKeys({
            jiraBaseUrl,
            basicAuth,
            boardId,
            requestedMaxResults: maxResults,
          });

          const searchResponse = await fetchProjectIssues({
            jiraBaseUrl,
            basicAuth,
            projectSelector,
            requestedMaxResults: maxResults,
          });

          if (!searchResponse.ok) {
            res.statusCode = searchResponse.status;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Jira request failed",
                details: searchResponse.details.slice(0, 500),
              }),
            );
            return;
          }

          const issues = Array.isArray(searchResponse.issues)
            ? searchResponse.issues.map((issue: any) => {
                const mapped = mapIssue(issue);
                mapped.inSprint = inSprintKeys.has(mapped.key);
                mapped.inBacklog = backlogKeys.has(mapped.key);
                return mapped;
              })
            : [];

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ issues, projectKey, projectId: projectSelector }));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error: "Failed to fetch Jira data",
              details:
                error instanceof Error ? error.message : "Unknown error",
            }),
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), jiraDevApiPlugin(env)],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@/components": fileURLToPath(
          new URL("./src/components", import.meta.url),
        ),
        "@/assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
        "@/hooks": fileURLToPath(new URL("./src/hooks", import.meta.url)),
        "@/utils": fileURLToPath(new URL("./src/utils", import.meta.url)),
        "@/types": fileURLToPath(new URL("./src/types", import.meta.url)),
        "@/lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
        "@/pages": fileURLToPath(new URL("./src/pages", import.meta.url)),
        "@/api": fileURLToPath(new URL("./src/api", import.meta.url)),
        "@/constants": fileURLToPath(
          new URL("./src/constants", import.meta.url),
        ),
      },
    },
  };
});
