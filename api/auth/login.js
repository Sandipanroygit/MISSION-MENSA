import {
  authenticate,
  createAccessToken,
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
  const password = (payload.password || "").toString();

  const errors = {};
  if (!email) errors.email = ["Email is required."];
  if (!password) errors.password = ["Password is required."];
  if (Object.keys(errors).length > 0) {
    sendValidationError(res, errors);
    return;
  }

  const user = authenticate(email, password);
  if (!user) {
    sendJson(res, 401, { message: "Email or password is incorrect." });
    return;
  }

  sendJson(res, 200, {
    access_token: createAccessToken(user),
    user,
  });
}
