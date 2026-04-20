const DEFAULT_BASE_URL = "https://indusschool-team-binv6fmz.atlassian.net";
const DEFAULT_PROJECT_KEY = "PM";
const DEFAULT_PROJECT_ID = "10071";

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
  const projectSelector = getProjectSelector(projectId, projectKey);

  if (!jiraEmail || !jiraApiToken) {
    res.status(500).json({
      error: "Jira credentials missing. Set JIRA_EMAIL and JIRA_API_TOKEN.",
    });
    return;
  }

  const maxResults = Math.min(
    Number.parseInt((req.query.maxResults || "30").toString(), 10) || 30,
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
      res.status(jiraResponse.status).json({
        error: "Jira request failed",
        details: details.slice(0, 500),
      });
      return;
    }

    const payload = await jiraResponse.json();
    const issues = Array.isArray(payload?.issues)
      ? payload.issues.map(mapIssue)
      : [];

    res.status(200).json({ issues, projectKey, projectId: projectSelector });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Jira data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
