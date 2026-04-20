const DEFAULT_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const DEFAULT_PROJECT_KEY = "PM";
const DEFAULT_PROJECT_ID = "10071";
const DEFAULT_BOARD_ID = "70";

function getProjectSelector(projectIdRaw, projectKeyRaw) {
  const projectId = (projectIdRaw || "").toString().trim();
  if (projectId) return projectId;
  return (projectKeyRaw || DEFAULT_PROJECT_KEY).toString().trim().toUpperCase();
}

function mapIssue(issue) {
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

async function fetchBoardBacklogKeys({
  jiraBaseUrl,
  basicAuth,
  boardId,
  requestedMaxResults,
}) {
  const backlogKeys = new Set();
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
      if (issue?.key) backlogKeys.add(issue.key);
    }

    const total = Number(payload?.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }

  return backlogKeys;
}

async function fetchSprintIssueKeys({
  jiraBaseUrl,
  basicAuth,
  projectSelector,
}) {
  const inSprintKeys = new Set();
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
      if (issue?.key) inSprintKeys.add(issue.key);
    }

    const total = Number(payload?.total || 0);
    startAt += issues.length;
    if (issues.length === 0 || startAt >= total) break;
  }

  return inSprintKeys;
}

async function fetchProjectIssues({
  jiraBaseUrl,
  basicAuth,
  projectSelector,
  requestedMaxResults,
}) {
  const allIssues = [];
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
        ok: false,
        status: jiraResponse.status,
        details,
        issues: [],
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
    ok: true,
    status: 200,
    details: "",
    issues: allIssues,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const jiraBaseUrl = process.env.JIRA_BASE_URL || DEFAULT_BASE_URL;
  const jiraEmail = process.env.JIRA_EMAIL;
  const jiraApiToken = process.env.JIRA_API_TOKEN;
  const projectKey =
    (req.query.projectKey || process.env.JIRA_PROJECT_KEY || DEFAULT_PROJECT_KEY)
      .toString()
      .trim()
      .toUpperCase();
  const projectId =
    (req.query.projectId || process.env.JIRA_PROJECT_ID || DEFAULT_PROJECT_ID)
      .toString()
      .trim();
  const boardId =
    (req.query.boardId || process.env.JIRA_BOARD_ID || DEFAULT_BOARD_ID)
      .toString()
      .trim();
  const projectSelector = getProjectSelector(projectId, projectKey);

  if (!jiraEmail || !jiraApiToken) {
    res.status(500).json({
      error: "Jira credentials missing. Set JIRA_EMAIL and JIRA_API_TOKEN.",
    });
    return;
  }

  const maxResults = Math.min(
    Number.parseInt((req.query.maxResults || "200").toString(), 10) || 200,
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
      res.status(searchResponse.status).json({
        error: "Jira request failed",
        details: searchResponse.details.slice(0, 500),
      });
      return;
    }

    const issues = Array.isArray(searchResponse.issues)
      ? searchResponse.issues.map((issue) => {
          const mapped = mapIssue(issue);
          mapped.inSprint = inSprintKeys.has(mapped.key);
          mapped.inBacklog = backlogKeys.has(mapped.key);
          return mapped;
        })
      : [];

    res.status(200).json({ issues, projectKey, projectId: projectSelector });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Jira data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
