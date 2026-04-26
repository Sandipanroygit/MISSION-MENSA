import {
  buildMeResponse,
  buildUserFromTokenPayload,
  getBearerToken,
  parseAccessToken,
  sendJson,
  sendMethodNotAllowed,
} from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    sendMethodNotAllowed(res);
    return;
  }

  const token = getBearerToken(req);
  const payload = parseAccessToken(token);
  if (!payload) {
    sendJson(res, 401, { message: "Unauthenticated." });
    return;
  }

  const user = buildUserFromTokenPayload(payload);
  sendJson(res, 200, buildMeResponse(user));
}
