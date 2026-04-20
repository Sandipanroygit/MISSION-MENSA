import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const DEFAULT_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const DEFAULT_PROJECT_KEY = "PM";
const DEFAULT_PROJECT_ID = "10071";

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
          Number.parseInt(url.searchParams.get("maxResults") || "30", 10) || 30,
          100,
        );

        const jql = `project = ${projectSelector} ORDER BY updated DESC`;
        const jiraUrl =
          `${jiraBaseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}` +
          `&maxResults=${maxResults}` +
          "&fields=summary,status,assignee,priority,updated,issuetype";

        const basicAuth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString(
          "base64",
        );

        try {
          const jiraResponse = await fetch(jiraUrl, {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Basic ${basicAuth}`,
            },
          });

          if (!jiraResponse.ok) {
            const details = await jiraResponse.text();
            res.statusCode = jiraResponse.status;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Jira request failed",
                details: details.slice(0, 500),
              }),
            );
            return;
          }

          const payload = await jiraResponse.json();
          const issues = Array.isArray(payload?.issues)
            ? payload.issues.map(mapIssue)
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
