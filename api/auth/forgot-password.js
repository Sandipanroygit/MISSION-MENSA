import {
  readJsonBody,
  sendJson,
  sendMethodNotAllowed,
  sendValidationError,
} from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    sendMethodNotAllowed(res);
    return;
  }

  const payload = await readJsonBody(req);
  const email = (payload.email || "").toString().trim();

  if (!email) {
    sendValidationError(res, { email: ["Email is required."] });
    return;
  }

  sendJson(res, 200, {
    message: "If the email exists, a reset link has been sent.",
  });
}
